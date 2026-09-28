import express from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  uploadCandidateResume,
} from "../controllers/candidateController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";
import {
  organizationMiddleware,
} from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.post(
  "/",
  createCandidate
);

router.get(
  "/",
  getCandidates
);

router.get(
  "/:id",
  getCandidateById
);

router.put(
  "/:id",
  updateCandidate
);

router.delete(
  "/:id",
  deleteCandidate
);
router.post(
  "/:id/resume",
  protect,
  organizationMiddleware,
  upload.single("resume"),
  uploadCandidateResume
);

export default router;