import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import { transitionApplicationStatus } from "../services/applicationStatusService.js";

export const createInterview = async (req, res, next) => {
  try {
    const organizationId = req.organization?._id || req.headers["x-organization-id"];
    const { application: applicationId, candidate, job } = req.body;

    const application = await Application.findOne({
      _id: applicationId,
      organization: organizationId,
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found for this organization" });
    }
    if (String(application.candidate) !== String(candidate) || String(application.job) !== String(job)) {
      return res.status(400).json({ success: false, message: "Interview candidate and job must match the selected application" });
    }

    const interview = await Interview.create({ ...req.body, organization: organizationId });

    if (interview.status !== "Cancelled") {
      await transitionApplicationStatus({
        application,
        status: "interview",
        changedBy: req.user?._id || null,
        source: "workflow",
        remarks: `Interview scheduled (${interview.interviewType})`,
      });
    }

    const populatedInterview = await Interview.findById(interview._id)
      .populate("candidate")
      .populate("job")
      .populate("interviewer");

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview: populatedInterview,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviews = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const interviews =
      await Interview.find({
        organization: organizationId,
      })
        .populate("candidate")
        .populate("job")
        .populate("interviewer")
        .sort({ interviewDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const interview =
      await Interview.findOne({
        _id: req.params.id,
        organization: organizationId,
      })
        .populate("candidate")
        .populate("job")
        .populate("interviewer");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const allowedFields = [
      "interviewType",
      "interviewDate",
      "startTime",
      "endTime",
      "mode",
      "location",
      "meetingLink",
      "status",
      "feedback",
      "scores",
      "overallScore",
      "notes",
      "interviewer",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const interview =
      await Interview.findOneAndUpdate(
        {
          _id: req.params.id,
          organization: organizationId,
        },
        updates,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("candidate")
        .populate("job")
        .populate("interviewer");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const interview =
      await Interview.findOneAndDelete({
        _id: req.params.id,
        organization: organizationId,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};