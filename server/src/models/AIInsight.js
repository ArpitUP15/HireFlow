import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    type: {
      type: String,
      enum: ["resume", "screening", "matching", "interview"],
      required: true,
    },
    status: { type: String, enum: ["succeeded", "failed"], required: true },
    model: String,
    result: mongoose.Schema.Types.Mixed,
    errorCode: String,
  },
  { timestamps: true },
);
schema.index({ organization: 1, candidate: 1, job: 1, type: 1, createdAt: -1 });
export default mongoose.model("AIInsight", schema);
