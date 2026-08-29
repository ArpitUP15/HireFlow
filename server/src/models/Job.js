const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      type: String,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: [
        "entry",
        "junior",
        "mid",
        "senior",
        "lead",
      ],
      default: "entry",
    },

    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "closed",
      ],
      default: "draft",
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({
  organization: 1,
  status: 1,
});

module.exports = mongoose.model(
  "Job",
  jobSchema
);