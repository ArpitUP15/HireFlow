import { createHash, randomBytes } from "node:crypto";
import mongoose from "mongoose";
import Invitation from "../models/Invitation.js";
import Notification from "../models/Notification.js";
import Organization from "../models/Organization.js";
import OrganizationMember from "../models/OrganizationMember.js";
import User from "../models/User.js";

const invitationRoles = [
  "hr_admin",
  "recruiter",
  "interviewer",
];

const editableOrganizationFields = [
  "name",
  "description",
  "logo",
  "website",
  "industry",
  "companySize",
];

const createError = (status, message) =>
  Object.assign(new Error(message), { status });

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const createSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const invitationUrl = (token) => {
  const baseUrl = (
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/+$/, "");

  return `${baseUrl}/accept-invitation?token=${encodeURIComponent(token)}`;
};

export const createOrganization = async (req, res, next) => {
  try {
    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Organization name must be between 2 and 100 characters",
      });
    }

    const baseSlug = createSlug(name);
    let slug = baseSlug;
    let suffix = 1;

    while (await Organization.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const organization = await Organization.create({
      name,
      slug,
      owner: req.user._id,
      description: req.body.description,
      logo: req.body.logo,
      website: req.body.website,
      industry: req.body.industry,
      companySize: req.body.companySize || undefined,
    });

    await OrganizationMember.create({
      organization: organization._id,
      user: req.user._id,
      role: "owner",
    });

    if (req.user.role === "candidate") {
      await User.updateOne(
        { _id: req.user._id, role: "candidate" },
        { $set: { role: "recruiter" } },
      );
    }

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrganization = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      organization: req.organization,
      membership: req.organizationMember,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMyOrganizations = async (req, res, next) => {
  try {
    const organizations = await OrganizationMember.find({
      user: req.user._id,
      status: "active",
    })
      .sort({ createdAt: 1 })
      .populate("organization");

    return res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of editableOrganizationFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (typeof updates.name === "string") {
      updates.name = updates.name.trim();
      if (updates.name.length < 2 || updates.name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Organization name must be between 2 and 100 characters",
        });
      }
    }

    const organization = await Organization.findByIdAndUpdate(
      req.organization._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await OrganizationMember.find({
      organization: req.organization._id,
      status: "active",
    })
      .sort({ createdAt: 1 })
      .populate("user", "firstName lastName email");

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return next(error);
  }
};

export const inviteMember = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const role = req.body.role || "recruiter";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required",
      });
    }

    if (!invitationRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization role",
      });
    }

    const invitedUser = await User.findOne({ email }).select("_id");
    if (
      invitedUser &&
      await OrganizationMember.exists({
        organization: req.organization._id,
        user: invitedUser._id,
        status: "active",
      })
    ) {
      return res.status(409).json({
        success: false,
        message: "This user is already a member of the organization",
      });
    }

    const pendingInvitation = await Invitation.findOne({
      organization: req.organization._id,
      email,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (pendingInvitation) {
      return res.status(409).json({
        success: false,
        message: "A pending invitation already exists for this email",
      });
    }

    const token = randomBytes(32).toString("hex");
    const invitation = await Invitation.create({
      organization: req.organization._id,
      email,
      role,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      invitedBy: req.user._id,
    });
    const link = invitationUrl(token);

    if (invitedUser) {
      await Notification.create({
        organization: req.organization._id,
        user: invitedUser._id,
        type: "invitation",
        title: `Invitation to ${req.organization.name}`,
        message: `You have been invited to join as a ${role}.`,
        metadata: { invitationId: invitation._id },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      invitation: {
        invitationLink: link,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const acceptInvitation = async (req, res, next) => {
  try {
    const { token, invitationId } = req.body;

    if (!token && !invitationId) {
      return res.status(400).json({
        success: false,
        message: "Invitation token or ID is required",
      });
    }

    if (
      invitationId &&
      !mongoose.Types.ObjectId.isValid(invitationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation ID",
      });
    }

    const invitation = token
      ? await Invitation.findOne({
          tokenHash: createHash("sha256").update(token).digest("hex"),
        }).populate("organization")
      : await Invitation.findById(invitationId).populate("organization");

    if (!invitation || invitation.status !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Invitation not found or has already been used",
      });
    }

    if (invitation.expiresAt <= new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(410).json({
        success: false,
        message: "This invitation has expired",
      });
    }

    if (normalizeEmail(req.user.email) !== invitation.email) {
      return res.status(403).json({
        success: false,
        message: "Sign in with the email address that received this invitation",
      });
    }

    await OrganizationMember.create({
      organization: invitation.organization._id,
      user: req.user._id,
      role: invitation.role,
    });

    invitation.status = "accepted";
    await invitation.save();

    if (req.user.role === "candidate") {
      await User.updateOne(
        { _id: req.user._id, role: "candidate" },
        { $set: { role: "recruiter" } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      organization: invitation.organization,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await OrganizationMember.findOne({
      _id: req.params.memberId,
      organization: req.organization._id,
      status: "active",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "The organization owner cannot be removed",
      });
    }

    await member.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const { role } = req.body;
    if (!invitationRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization role",
      });
    }

    const member = await OrganizationMember.findOne({
      _id: req.params.memberId,
      organization: req.organization._id,
      status: "active",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "The organization owner's role cannot be changed",
      });
    }

    member.role = role;
    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member,
    });
  } catch (error) {
    return next(error);
  }
};
