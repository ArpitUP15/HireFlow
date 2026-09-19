import mongoose from "mongoose";


// =====================================================
// INTERVIEW SCHEMA
// =====================================================

const interviewSchema = new mongoose.Schema(
  {
    // -------------------------------------------------
    // Organization
    // -------------------------------------------------

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },


    // -------------------------------------------------
    // Application
    // -------------------------------------------------

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },


    // -------------------------------------------------
    // Job
    // -------------------------------------------------

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },


    // -------------------------------------------------
    // Candidate
    // -------------------------------------------------

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },


    // -------------------------------------------------
    // Interview Title
    // -------------------------------------------------

    title: {
      type: String,
      required: true,
      trim: true,
    },


    // -------------------------------------------------
    // Interview Round
    // -------------------------------------------------

    round: {
      type: String,
      enum: [
        "screening",
        "technical",
        "hr",
        "managerial",
        "final",
        "custom",
      ],
      default: "technical",
    },


    // -------------------------------------------------
    // Custom Round Name
    // -------------------------------------------------

    roundName: {
      type: String,
      trim: true,
      default: "",
    },


    // -------------------------------------------------
    // Interview Type
    // -------------------------------------------------

    type: {
      type: String,
      enum: [
        "video",
        "phone",
        "onsite",
      ],
      default: "video",
    },


    // -------------------------------------------------
    // Interview Date
    // -------------------------------------------------

    scheduledAt: {
      type: Date,
      required: true,
    },


    // -------------------------------------------------
    // Duration
    // -------------------------------------------------

    duration: {
      type: Number,
      required: true,
      min: 15,
      default: 60,
    },


    // -------------------------------------------------
    // Meeting Information
    // -------------------------------------------------

    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },


    location: {
      type: String,
      trim: true,
      default: "",
    },


    // -------------------------------------------------
    // Interviewers
    // -------------------------------------------------

    interviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],


    // -------------------------------------------------
    // Status
    // -------------------------------------------------

    status: {
      type: String,
      enum: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      default: "scheduled",
    },


    // -------------------------------------------------
    // Feedback
    // -------------------------------------------------

    feedback: {
      type: String,
      trim: true,
      default: "",
    },


    // -------------------------------------------------
    // Score
    // -------------------------------------------------

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },


    // -------------------------------------------------
    // Recommendation
    // -------------------------------------------------

    recommendation: {
      type: String,
      enum: [
        "strong_yes",
        "yes",
        "neutral",
        "no",
        "strong_no",
        "",
      ],
      default: "",
    },


    // -------------------------------------------------
    // Hiring Decision
    // -------------------------------------------------

    hiringDecision: {
      type: String,
      enum: [
        "pending",
        "hire",
        "reject",
        "hold",
      ],
      default: "pending",
    },


    // -------------------------------------------------
    // Notes
    // -------------------------------------------------

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);


// =====================================================
// INDEXES
// =====================================================

interviewSchema.index({
  organization: 1,
  scheduledAt: 1,
});

interviewSchema.index({
  organization: 1,
  status: 1,
});

interviewSchema.index({
  application: 1,
});


export default mongoose.model(
  "Interview",
  interviewSchema
);