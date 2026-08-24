import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from "../controllers/authController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected
router.get("/me", protect, getCurrentUser);

// Example role-protected routes
router.get(
  "/recruiter-access",
  protect,
  authorize("recruiter", "hr_admin", "super_admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Recruiter resource accessed",
      user: req.user.toJSON()
    });
  }
);

router.get(
  "/admin-access",
  protect,
  authorize("hr_admin", "super_admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "HR Admin resource accessed",
      user: req.user.toJSON()
    });
  }
);

router.get(
  "/super-admin-access",
  protect,
  authorize("super_admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Super Admin resource accessed",
      user: req.user.toJSON()
    });
  }
);

export default router;