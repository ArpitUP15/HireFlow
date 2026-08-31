import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    headline: {
      type: String,
      trim: true,
    },

    summary: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: [
      {
        degree: String,
        institution: String,
        graduationYear: Number,
      },
    ],

    resumeUrl: {
      type: String,
      default: "",
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    portfolioUrl: {
      type: String,
      default: "",
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
  },
  {
    timestamps: true,
  }
);

candidateSchema.index({
  organization: 1,
  email: 1,
});

export default mongoose.model(
  "Candidate",
  candidateSchema
);