import express from "express";

import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
  addInterviewFeedback,
  updateHiringDecision,
  deleteInterview,
} from "../controllers/interviewController.js";

import protect from "../middleware/authMiddleware.js";

import organizationMiddleware from "../middleware/organizationMiddleware.js";


// =====================================================
// ROUTER
// =====================================================

const router =
  express.Router();


// =====================================================
// PROTECTED ORGANIZATION ROUTES
// =====================================================

router.use(protect);

router.use(
  organizationMiddleware
);


// =====================================================
// INTERVIEWS
// =====================================================

router.post(
  "/",
  createInterview
);


router.get(
  "/",
  getInterviews
);


// =====================================================
// IMPORTANT
// Specific routes MUST come before /:id
// =====================================================

router.patch(
  "/:id/status",
  updateInterviewStatus
);


router.patch(
  "/:id/feedback",
  addInterviewFeedback
);


router.patch(
  "/:id/hiring-decision",
  updateHiringDecision
);


// =====================================================
// SINGLE INTERVIEW
// =====================================================

router.get(
  "/:id",
  getInterviewById
);


router.put(
  "/:id",
  updateInterview
);


router.delete(
  "/:id",
  deleteInterview
);


export default router;