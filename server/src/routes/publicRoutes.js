import express from "express";
import statsRoutes from "./statsRoutes.js";

import {
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

router.use("/stats", statsRoutes);


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