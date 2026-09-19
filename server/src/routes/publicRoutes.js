import express from "express";

import {
  getPublicStats,
  submitContactMessage,
} from "../controllers/publicController.js";


// =====================================================
// ROUTER
// =====================================================

const router =
  express.Router();


// =====================================================
// PUBLIC STATISTICS
// =====================================================

router.get(
  "/stats",
  getPublicStats
);


// =====================================================
// CONTACT FORM
// =====================================================

router.post(
  "/contact",
  submitContactMessage
);


// =====================================================
// EXPORT
// =====================================================

export default router;