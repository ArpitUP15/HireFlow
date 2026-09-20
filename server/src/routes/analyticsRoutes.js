import express from "express";

import {
  getDashboardAnalytics,
} from "../controllers/analyticsController.js";

import protect from "../middleware/authMiddleware.js";
import organizationMiddleware from "../middleware/organizationMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
| GET /api/analytics/dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  protect,
  organizationMiddleware,
  getDashboardAnalytics
);

export default router;