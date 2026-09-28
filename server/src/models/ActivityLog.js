import mongoose from "mongoose";

const activityLogSchema =
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
      },

      action: {
        type: String,
        required: true,
      },

      entity: {
        type: String,
        required: true,
      },

      entityId: {
        type: mongoose.Schema.Types.ObjectId,
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
  "ActivityLog",
  activityLogSchema
);