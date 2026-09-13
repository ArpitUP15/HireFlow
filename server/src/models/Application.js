import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      default: "applied",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "website",
        "linkedin",
        "referral",
        "job-board",
        "manual",
        "other",
      ],
      default: "manual",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    recruiterNotes: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    lastStatusChangedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application of the same candidate
// to the same job within an organization.
applicationSchema.index(
  {
    organization: 1,
    job: 1,
    candidate: 1,
  },
  {
    unique: true,
  }
);

applicationSchema.index({
  organization: 1,
  status: 1,
});

export default mongoose.model(
  "Application",
  applicationSchema
);