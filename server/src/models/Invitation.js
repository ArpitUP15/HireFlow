import mongoose from "mongoose";

const invitationSchema =
  new mongoose.Schema(
    {
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },

      role: {
        type: String,
        enum: [
          "hr_admin",
          "recruiter",
          "interviewer"
        ],
        default: "recruiter"
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true
      },

      expiresAt: {
        type: Date,
        required: true
      },

      invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      status: {
        type: String,
        enum: [
          "pending",
          "accepted",
          "expired",
          "cancelled"
        ],
        default: "pending"
      }
    },
    {
      timestamps: true
    }
  );

const Invitation =
  mongoose.model(
    "Invitation",
    invitationSchema
  );

export default Invitation;