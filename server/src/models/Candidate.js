import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // ORGANIZATION
    // --------------------------------------------------
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // --------------------------------------------------
    // BASIC INFORMATION
    // --------------------------------------------------
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
      default: "",
    },

    // --------------------------------------------------
    // PROFESSIONAL INFORMATION
    // --------------------------------------------------
    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },

    resumeFileName: {
      type: String,
      trim: true,
      default: "",
    },

    // --------------------------------------------------
    // AI SCREENING
    // --------------------------------------------------
    aiScreening: {
      matchScore: {
        type: Number,
        default: null,
        min: 0,
        max: 100,
      },

      skillsMatched: {
        type: [String],
        default: [],
      },

      skillsMissing: {
        type: [String],
        default: [],
      },

      strengths: {
        type: [String],
        default: [],
      },

      concerns: {
        type: [String],
        default: [],
      },

      recommendation: {
        type: String,
        trim: true,
        default: "",
      },

      analyzedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// INDEX FOR AI-ASSISTED CANDIDATE RANKING
// --------------------------------------------------
candidateSchema.index({
  organization: 1,
  "aiScreening.matchScore": -1,
});

// --------------------------------------------------
// OPTIONAL COMPOUND INDEX
// Helps find candidates within an organization
// sorted by latest AI analysis.
// --------------------------------------------------
candidateSchema.index({
  organization: 1,
  "aiScreening.analyzedAt": -1,
});

// --------------------------------------------------
// MODEL
// --------------------------------------------------
const Candidate = mongoose.model(
  "Candidate",
  candidateSchema
);

export default Candidate;