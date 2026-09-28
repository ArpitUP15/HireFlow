import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        "Technical",
        "HR",
        "Behavioral",
        "Screening",
        "Final",
      ],
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    startTime: String,

    endTime: String,

    mode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Hybrid",
      ],
      default: "Online",
    },

    location: String,

    meetingLink: String,

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Rescheduled",
        "No Show",
      ],
      default: "Scheduled",
    },

    feedback: {
      type: String,
      default: "",
    },

    scores: {
      dsa: {
        type: Number,
        min: 0,
        max: 10,
      },

      react: {
        type: Number,
        min: 0,
        max: 10,
      },

      node: {
        type: Number,
        min: 0,
        max: 10,
      },

      communication: {
        type: Number,
        min: 0,
        max: 10,
      },
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Interview",
  interviewSchema
);