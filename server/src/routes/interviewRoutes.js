import express from "express";

import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

import protect from "../middleware/authMiddleware.js";
import organizationMiddleware from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.post("/", createInterview);

router.get("/", getInterviews);

router.get("/:id", getInterviewById);

router.put("/:id", updateInterview);

router.delete("/:id", deleteInterview);

export default router;