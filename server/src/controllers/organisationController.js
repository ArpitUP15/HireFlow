import mongoose from "mongoose";
import crypto from "crypto";

import Organization from "../models/Organization.js";
import OrganizationMember from "../models/OrganizationMember.js";
import Invitation from "../models/Invitation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

import {
  generateInvitationToken,
  hashInvitationToken
} from "../utils/generateInvitationToken.js";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

// ------------------------------------------------
// Create organization
// ------------------------------------------------

export const createOrganization =
  async (req, res) => {
    const {
      name,
      description,
      website,
      industry,
      companySize
    } = req.body;

    if (!name) {
      res.status(400);

      throw new Error(
        "Organization name is required"
      );
    }

    const slug =
      `${name}-${crypto
        .randomBytes(4)
        .toString("hex")}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    const organization =
      await Organization.create({
        name,
        slug,
        description,
        website,
        industry,
        companySize,
        owner: req.user._id
      });

    // Owner permissions

    await OrganizationMember.create({
      organization:
        organization._id,

      user: req.user._id,

      role: "owner",

      permissions: {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: true,
        viewAnalytics: true
      }
    });

    res.status(201).json({
      success: true,
      message:
        "Organization created successfully",
      organization
    });
  };

// ------------------------------------------------
// Get current organization
// ------------------------------------------------

export const getOrganization =
  async (req, res) => {
    const organization =
      await Organization.findById(
        req.organization._id
      ).populate(
        "owner",
        "firstName lastName email"
      );

    if (!organization) {
      res.status(404);

      throw new Error(
        "Organization not found"
      );
    }

    res.status(200).json({
      success: true,
      organization,
      membership:
        req.organizationMember
    });
  };

// =====================================================
// GET MY ORGANIZATIONS
// =====================================================

export const getMyOrganizations =
  async (req, res) => {

    const memberships =
      await OrganizationMember.find({
        user: req.user._id,
        status: "active",
      })
        .populate(
          "organization"
        )
        .sort({
          createdAt: 1,
        });


    const organizations =
      memberships.map(
        (membership) => ({
          organization:
            membership.organization,

          membershipId:
            membership._id,

          role:
            membership.role,

          permissions:
            membership.permissions,
        })
      );


    res.status(200).json({
      success: true,

      count:
        organizations.length,

      organizations,
    });
  };

// ------------------------------------------------
// Update organization
// ------------------------------------------------

export const updateOrganization =
  async (req, res) => {
    const {
      name,
      description,
      logo,
      website,
      industry,
      companySize
    } = req.body;

    const organization =
      await Organization.findById(
        req.organization._id
      );

    if (!organization) {
      res.status(404);

      throw new Error(
        "Organization not found"
      );
    }

    if (name !== undefined)
      organization.name = name;

    if (description !== undefined)
      organization.description =
        description;

    if (logo !== undefined)
      organization.logo = logo;

    if (website !== undefined)
      organization.website =
        website;

    if (industry !== undefined)
      organization.industry =
        industry;

    if (companySize !== undefined)
      organization.companySize =
        companySize;

    await organization.save();

    res.status(200).json({
      success: true,
      message:
        "Organization updated successfully",
      organization
    });
  };

// ------------------------------------------------
// Get members
// ------------------------------------------------

export const getMembers =
  async (req, res) => {
    const members =
      await OrganizationMember.find({
        organization:
          req.organization._id
      })
        .populate(
          "user",
          "firstName lastName email avatar phone"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  };

// ------------------------------------------------
// Invite employee
// ------------------------------------------------

export const inviteMember =
  async (req, res) => {
    const {
      email,
      role
    } = req.body;

    if (!email) {
      res.status(400);

      throw new Error(
        "Email is required"
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const allowedRoles = [
      "hr_admin",
      "recruiter",
      "interviewer"
    ];

    const memberRole =
      allowedRoles.includes(role)
        ? role
        : "recruiter";

    // Check existing user
    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      const existingMember =
        await OrganizationMember.findOne({
          organization:
            req.organization._id,
          user: existingUser._id
        });

      if (existingMember) {
        res.status(409);

        throw new Error(
          "User is already a member of this organization"
        );
      }
    }

    // Existing pending invitation
    const existingInvitation =
      await Invitation.findOne({
        organization:
          req.organization._id,

        email: normalizedEmail,

        status: "pending",

        expiresAt: {
          $gt: new Date()
        }
      });

    if (existingInvitation) {
      res.status(409);

      throw new Error(
        "A pending invitation already exists for this email"
      );
    }

    const rawToken =
      generateInvitationToken();

    const tokenHash =
      hashInvitationToken(
        rawToken
      );

    const invitation =
      await Invitation.create({
        organization:
          req.organization._id,

        email: normalizedEmail,

        role: memberRole,

        tokenHash,

        expiresAt:
          new Date(
            Date.now() +
              48 *
                60 *
                60 *
                1000
          ),

        invitedBy:
          req.user._id
      });

    const clientUrl =
      (process.env.CLIENT_URL || "http://localhost:5173")
        .replace(/\/+$/, "");
    const invitationLink =
      `${clientUrl}/accept-invitation?token=${rawToken}`;

    let notification;
    try {
      if (existingUser) {
        notification = await Notification.create({
          organization: req.organization._id,
          user: existingUser._id,
          type: "invitation",
          title: "Organization invitation",
          message: `${req.user.firstName} ${req.user.lastName} invited you to join ${req.organization.name} as ${memberRole.replace("_", " ")}.`,
          metadata: {
            invitationId: invitation._id.toString()
          }
        });
      }

      const inviterName =
        `${req.user.firstName} ${req.user.lastName}`.trim();
      const roleName = memberRole.replace("_", " ");
      const organizationName = req.organization.name;
      const safeLink = escapeHtml(invitationLink);
      const text =
        `${inviterName} invited you to join ${organizationName} on HireFlow as ${roleName}.\n\n` +
        `Accept the invitation: ${invitationLink}\n\n` +
        "This invitation expires in 48 hours. Sign in or create an account using this email address to accept it. Choose the Recruiter account type when registering.";
      const html =
        `<p>${escapeHtml(inviterName)} invited you to join ` +
        `<strong>${escapeHtml(organizationName)}</strong> on HireFlow as ` +
        `${escapeHtml(roleName)}.</p>` +
        `<p><a href="${safeLink}">Accept invitation</a></p>` +
        "<p>This invitation expires in 48 hours. Sign in or create an account using this email address to accept it. Choose the Recruiter account type when registering.</p>";

      await sendEmail({
        to: normalizedEmail,
        subject: `Invitation to join ${organizationName} on HireFlow`,
        text,
        html
      });
    } catch (error) {
      if (notification) {
        await Notification.deleteOne({
          _id: notification._id
        });
      }
      await Invitation.deleteOne({
        _id: invitation._id
      });
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Invitation email sent successfully",

      invitation: {
        id: invitation._id,
        email:
          invitation.email,
        role:
          invitation.role,
        expiresAt:
          invitation.expiresAt,
        emailSent: true,
        notificationSent: Boolean(notification)
      }
    });
  };

// ------------------------------------------------
// Accept invitation
// ------------------------------------------------

export const acceptInvitation =
  async (req, res) => {
    const {
      token
    } = req.body;

    const { invitationId } = req.body;

    if (!token && !invitationId) {
      res.status(400);

      throw new Error(
        "Invitation token or invitation ID is required"
      );
    }

    let invitation;
    if (token) {
      const tokenHash =
        hashInvitationToken(token);

      invitation = await Invitation.findOne({
        tokenHash,
        status: "pending"
      });
    } else {
      if (!mongoose.Types.ObjectId.isValid(invitationId)) {
        res.status(400);
        throw new Error("Invalid invitation ID");
      }

      invitation = await Invitation.findOne({
        _id: invitationId,
        status: "pending"
      });
    }

    if (!invitation) {
      res.status(404);

      throw new Error(
        "Invalid or already used invitation"
      );
    }

    if (
      invitation.expiresAt <
      new Date()
    ) {
      invitation.status =
        "expired";

      await invitation.save();

      res.status(400);

      throw new Error(
        "Invitation has expired"
      );
    }

    // Logged-in user's email must match
    if (
      req.user.email.toLowerCase() !==
      invitation.email.toLowerCase()
    ) {
      res.status(403);

      throw new Error(
        "This invitation belongs to a different email address"
      );
    }

    const existingMember =
      await OrganizationMember.findOne({
        organization:
          invitation.organization,

        user: req.user._id
      });

    if (existingMember) {
      invitation.status =
        "accepted";

      await invitation.save();

      res.status(409);

      throw new Error(
        "You are already a member of this organization"
      );
    }

    if (req.user.role === "candidate") {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { role: "recruiter" } }
      );
    }

    let permissions = {
      manageJobs: false,
      manageCandidates: false,
      manageApplications: false,
      manageInterviews: false,
      manageMembers: false,
      viewAnalytics: false
    };

    if (
      invitation.role ===
      "hr_admin"
    ) {
      permissions = {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: true,
        viewAnalytics: true
      };
    }

    if (
      invitation.role ===
      "recruiter"
    ) {
      permissions = {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: false,
        viewAnalytics: true
      };
    }

    if (
      invitation.role ===
      "interviewer"
    ) {
      permissions = {
        manageJobs: false,
        manageCandidates: false,
        manageApplications: false,
        manageInterviews: true,
        manageMembers: false,
        viewAnalytics: false
      };
    }

    const member =
      await OrganizationMember.create({
        organization:
          invitation.organization,

        user:
          req.user._id,

        role:
          invitation.role,

        permissions
      });

    invitation.status =
      "accepted";

    await invitation.save();

    res.status(201).json({
      success: true,
      message:
        "Invitation accepted successfully",
      member
    });
  };

// ------------------------------------------------
// Remove member
// ------------------------------------------------

export const removeMember =
  async (req, res) => {
    const {
      memberId
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        memberId
      )
    ) {
      res.status(400);

      throw new Error(
        "Invalid member ID"
      );
    }

    const member =
      await OrganizationMember.findOne({
        _id: memberId,

        organization:
          req.organization._id
      });

    if (!member) {
      res.status(404);

      throw new Error(
        "Organization member not found"
      );
    }

    if (
      member.role ===
      "owner"
    ) {
      res.status(400);

      throw new Error(
        "Organization owner cannot be removed"
      );
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Member removed successfully"
    });
  };

// ------------------------------------------------
// Update member role
// ------------------------------------------------

export const updateMemberRole =
  async (req, res) => {
    const {
      memberId
    } = req.params;

    const {
      role
    } = req.body;

    const allowedRoles = [
      "hr_admin",
      "recruiter",
      "interviewer"
    ];

    if (
      !allowedRoles.includes(role)
    ) {
      res.status(400);

      throw new Error(
        "Invalid organization role"
      );
    }

    const member =
      await OrganizationMember.findOne({
        _id: memberId,

        organization:
          req.organization._id
      });

    if (!member) {
      res.status(404);

      throw new Error(
        "Member not found"
      );
    }

    if (
      member.role ===
      "owner"
    ) {
      res.status(400);

      throw new Error(
        "Owner role cannot be changed"
      );
    }

    member.role = role;

    if (
      role === "hr_admin"
    ) {
      member.permissions = {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: true,
        viewAnalytics: true
      };
    }

    if (
      role === "recruiter"
    ) {
      member.permissions = {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: false,
        viewAnalytics: true
      };
    }

    if (
      role === "interviewer"
    ) {
      member.permissions = {
        manageJobs: false,
        manageCandidates: false,
        manageApplications: false,
        manageInterviews: true,
        manageMembers: false,
        viewAnalytics: false
      };
    }

    await member.save();

    res.status(200).json({
      success: true,
      message:
        "Member role updated successfully",
      member
    });
  };