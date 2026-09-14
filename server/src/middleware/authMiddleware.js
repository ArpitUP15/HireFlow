import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log("\n========== AUTH DEBUG ==========");
    console.log("Cookies:", req.cookies);
    console.log(
      "HireFlow Token:",
      req.cookies?.hireflow_token
    );
    console.log("JWT Secret exists:", !!process.env.JWT_SECRET);

    const token = req.cookies?.hireflow_token;

    if (!token) {
      res.status(401);
      throw new Error("Not authenticated. Please login.");
    }

    console.log("Token received successfully");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.userId);

    console.log("User found:", !!user);

    if (!user) {
      res.status(401);
      throw new Error(
        "User associated with this token no longer exists"
      );
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error(
        "Your account has been deactivated"
      );
    }

    req.user = user;

    console.log(
      "Authentication successful:",
      user.email
    );

    console.log("================================\n");

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      res.status(401);

      return next(
        new Error(
          "Invalid or expired authentication token"
        )
      );
    }

    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);

      return next(
        new Error("Authentication required")
      );
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);

      return next(
        new Error(
          "You do not have permission to access this resource"
        )
      );
    }

    next();
  };
};