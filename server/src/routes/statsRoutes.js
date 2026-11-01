import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import Organization from "../models/Organization.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
const router = Router();
router.get("/", protect, async (req, res, next) => {
  try {
    const [organizations, jobsPosted, hiredCandidates] = await Promise.all([
      Organization.countDocuments({}),
      Job.countDocuments({ status: { $in: ["published", "closed"] } }),
      Application.distinct("candidate", { status: "selected" }),
    ]);
    res
      .set("Cache-Control", "no-store")
      .json({
        success: true,
        data: {
          organizations,
          jobsPosted,
          candidatesHired: hiredCandidates.length,
          updatedAt: new Date().toISOString(),
        },
      });
  } catch (error) {
    next(error);
  }
});
export default router;
