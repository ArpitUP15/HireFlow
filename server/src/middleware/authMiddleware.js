import jwt from "jsonwebtoken";

import User from "../models/User.js";


// =====================================================
// PROTECT ROUTES
// =====================================================

export const protect = async (
  req,
  res,
  next
) => {
  try {

    const token =
      req.cookies?.hireflow_token;


    // -------------------------------------------------
    // No token
    // -------------------------------------------------

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authenticated. Please login.",
      });
    }


    // -------------------------------------------------
    // JWT secret check
    // -------------------------------------------------

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured",
      });
    }


    // -------------------------------------------------
    // Verify token
    // -------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });
    }


    // -------------------------------------------------
    // Find user
    // -------------------------------------------------

    const user =
      await User.findById(
        decoded.userId
      );


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User associated with this token no longer exists",
      });
    }


    // -------------------------------------------------
    // Check active status
    // -------------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated",
      });
    }


    // -------------------------------------------------
    // Attach user
    // -------------------------------------------------

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "Authentication middleware error:",
      error.message
    );


    if (
      error.name ===
        "JsonWebTokenError" ||
      error.name ===
        "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Authentication failed",
    });
  }
};


// =====================================================
// ROLE AUTHORIZATION
// =====================================================

export const authorize =
  (...roles) => {

    return (
      req,
      res,
      next
    ) => {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }


      if (
        !roles.includes(
          req.user.role
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this resource",
        });
      }


      next();
    };
  };