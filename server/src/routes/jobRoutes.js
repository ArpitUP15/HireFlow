import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  publishJob,
  closeJob,
} from "../controllers/jobController.js";
import {
  protect,
} from "../middleware/authMiddleware.js";
import {
  organizationMiddleware,
} from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.post("/", createJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

router.patch(
  "/:id/publish",
  publishJob
);

router.patch(
  "/:id/close",
  closeJob
);

export default router;