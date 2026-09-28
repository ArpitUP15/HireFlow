import express from "express";

import {
  getAdminProfile,
  getAdminDashboard,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllOrganizations,
  getOrganizationById,
  deleteOrganization,
  getSystemStatistics,
} from "../controllers/adminController.js";

import {
  createOrganization,
} from "../controllers/organisationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================================
// ADMIN AUTHORIZATION
// ============================================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please login.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};


// ============================================================
// ADMIN PROFILE
// ============================================================

router.get(
  "/me",
  protect,
  adminOnly,
  getAdminProfile
);


// ============================================================
// ADMIN DASHBOARD
// ============================================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);


// ============================================================
// SYSTEM STATISTICS
// ============================================================

router.get(
  "/statistics",
  protect,
  adminOnly,
  getSystemStatistics
);


// ============================================================
// USERS
// ============================================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.get(
  "/users/:id",
  protect,
  adminOnly,
  getUserById
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);


// ============================================================
// ORGANIZATIONS
// ============================================================

router.get(
  "/organizations",
  protect,
  adminOnly,
  getAllOrganizations
);

router.post(
  "/organizations",
  protect,
  adminOnly,
  createOrganization
);

router.get(
  "/:id",
  protect,
  getOrganizationById
);

router.get(
  "/organizations/:id",
  protect,
  adminOnly,
  getOrganizationById
);

router.delete(
  "/organizations/:id",
  protect,
  adminOnly,
  deleteOrganization
);


// ============================================================
// EXPORT
// ============================================================

export default router;