import express from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  loadOrganization,
} from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(loadOrganization);

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

export default router;