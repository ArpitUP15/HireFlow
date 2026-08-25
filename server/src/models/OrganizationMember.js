import mongoose from "mongoose";

const organizationMemberSchema =
  new mongoose.Schema(
    {
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      role: {
        type: String,
        enum: [
          "owner",
          "hr_admin",
          "recruiter",
          "interviewer"
        ],
        default: "recruiter"
      },

      permissions: {
        manageJobs: {
          type: Boolean,
          default: false
        },

        manageCandidates: {
          type: Boolean,
          default: false
        },

        manageApplications: {
          type: Boolean,
          default: false
        },

        manageInterviews: {
          type: Boolean,
          default: false
        },

        manageMembers: {
          type: Boolean,
          default: false
        },

        viewAnalytics: {
          type: Boolean,
          default: false
        }
      },

      status: {
        type: String,
        enum: [
          "active",
          "suspended"
        ],
        default: "active"
      },

      joinedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );

organizationMemberSchema.index(
  {
    organization: 1,
    user: 1
  },
  {
    unique: true
  }
);

const OrganizationMember =
  mongoose.model(
    "OrganizationMember",
    organizationMemberSchema
  );

export default OrganizationMember;