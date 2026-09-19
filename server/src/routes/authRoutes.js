import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


// =====================================================
// PUBLIC AUTH ROUTES
// =====================================================

router.post(
  "/register",
  registerUser
);


router.post(
  "/login",
  loginUser
);


// =====================================================
// PROTECTED AUTH ROUTES
// =====================================================

router.post(
  "/logout",
  logoutUser
);


router.get(
  "/me",
  protect,
  getCurrentUser
);


export default router;