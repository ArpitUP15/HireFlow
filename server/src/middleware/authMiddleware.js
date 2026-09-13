import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.hireflow_token;

    if (!token) {
      res.status(401);

      throw new Error(
        "Not authenticated. Please login."
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

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

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
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

// --------------------------------------
// Role authorization
// --------------------------------------

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