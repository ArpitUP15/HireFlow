import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { emitToOrganization } from "../socket.js";

const LABELS = {
  applied: "Applied",
  screening: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  selected: "Selected",
  rejected: "Rejected",
};

/**
 * The single status transition path used by recruiter decisions and workflow events.
 * It deliberately does not allow AI to make a hiring decision.
 */
export const transitionApplicationStatus = async ({
  application,
  status,
  changedBy = null,
  source = "system",
  remarks = "",
}) => {
  if (!application) {
    const error = new Error("Application not found");
    error.status = 404;
    throw error;
  }

  if (application.status === status) return application;

  const previousStatus = application.status;
  const changedAt = new Date();
  application.status = status;
  application.lastStatusChangedAt = changedAt;
  application.statusHistory.push({
    status,
    changedAt,
    changedBy,
    source,
    remarks: String(remarks || "").slice(0, 1000),
  });
  await application.save();

  const populated = await application.populate([
      { path: "candidate", select: "firstName lastName email" },
      { path: "job", select: "title" },
    ]);

  // Candidate profiles are not directly linked to Candidate documents in this project;
  // resolve the candidate account by its verified account email.
  const email = populated?.candidate?.email;
  const recipient = email
    ? await User.findOne({ email: email.toLowerCase(), role: "candidate", isActive: true }).select("_id")
    : null;

  const title = `Application status: ${LABELS[status]}`;
  const message = `Your application for ${populated?.job?.title || "the position"} has moved from ${LABELS[previousStatus] || previousStatus} to ${LABELS[status]}.`;

  if (recipient) {
    await Notification.create({
      organization: application.organization,
      user: recipient._id,
      type: status === "interview" ? "interview" : "application",
      title,
      message,
      metadata: {
        applicationId: application._id,
        jobId: populated?.job?._id,
        status,
        previousStatus,
      },
    });
    emitToOrganization(application.organization.toString(), "application:status-updated", {
      applicationId: application._id,
      candidateUserId: recipient._id,
      status,
      previousStatus,
      changedAt,
    });
  }

  return application;
};
