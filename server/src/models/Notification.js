import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "application",
          "interview",
          "candidate",
          "system",
        ],
        default: "system",
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      read: {
        type: Boolean,
        default: false,
      },

      metadata: {
        type: Object,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Notification",
  notificationSchema
);