import express from "express";

import {
  screenCandidate,
} from "../controllers/aiController.js";

import protect from "../middleware/authMiddleware.js";
import organizationMiddleware from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.post(
  "/screen/:candidateId",
  protect,
  organizationMiddleware,
  screenCandidate
);

export default router;