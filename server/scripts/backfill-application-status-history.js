import "dotenv/config";
import mongoose from "mongoose";
import Application from "../src/models/Application.js";

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  await mongoose.connect(process.env.MONGO_URI);
  const cursor = Application.find({ $or: [{ statusHistory: { $exists: false } }, { statusHistory: { $size: 0 } }] }).cursor();
  let updated = 0;
  for await (const application of cursor) {
    application.statusHistory = [{
      status: application.status || "applied",
      changedAt: application.lastStatusChangedAt || application.appliedAt || application.createdAt || new Date(),
      changedBy: application.createdBy || null,
      source: "system",
      remarks: "Historical status imported during status-history migration",
    }];
    await application.save();
    updated += 1;
  }
  console.log(`Backfilled status history for ${updated} applications.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
