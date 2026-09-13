import express from "express";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getJobApplications,
  getCandidateApplications,
  getRecruitmentPipeline,
} from "../controllers/applicationController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  organizationMiddleware,
} from "../middleware/organizationMiddleware.js";

const router = express.Router();


// ==========================================
// PROTECTION
// ==========================================

router.use(protect);

router.use(
  organizationMiddleware
);


// ==========================================
// APPLICATION ROUTES
// ==========================================

router.post(
  "/",
  createApplication
);

router.get(
  "/",
  getApplications
);

router.get(
  "/pipeline",
  getRecruitmentPipeline
);

router.get(
  "/job/:jobId",
  getJobApplications
);

router.get(
  "/candidate/:candidateId",
  getCandidateApplications
);

router.get(
  "/:id",
  getApplicationById
);

router.put(
  "/:id",
  updateApplication
);

router.patch(
  "/:id/status",
  updateApplicationStatus
);

router.delete(
  "/:id",
  deleteApplication
);


export default router;