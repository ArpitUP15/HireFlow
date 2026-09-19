import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// =====================================================
// COOKIE OPTIONS
// =====================================================

const getCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction
      ? "none"
      : "lax",

    maxAge:
      7 *
      24 *
      60 *
      60 *
      1000,

    path: "/",
  };
};


// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
    } = req.body;


    // -------------------------------------------------
    // Validate input
    // -------------------------------------------------

    const cleanFirstName =
      firstName?.trim();

    const cleanLastName =
      lastName?.trim();

    const cleanEmail =
      email?.trim().toLowerCase();


    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and password are required",
      });
    }


    // -------------------------------------------------
    // Validate email
    // -------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }


    // -------------------------------------------------
    // Validate password
    // -------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }


    // -------------------------------------------------
    // Check existing user
    // -------------------------------------------------

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }


    // -------------------------------------------------
    // Publicly allowed roles
    // -------------------------------------------------

    const allowedRoles = [
      "candidate",
      "recruiter",
    ];

    const userRole =
      allowedRoles.includes(role)
        ? role
        : "candidate";


    // -------------------------------------------------
    // Create user
    // -------------------------------------------------

    const user =
      await User.create({
        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        email:
          cleanEmail,

        password,

        role:
          userRole,
      });


    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to create account",
      });
    }


    // -------------------------------------------------
    // Generate JWT
    // -------------------------------------------------

    const token =
      generateToken(user._id);


    // -------------------------------------------------
    // Set authentication cookie
    // -------------------------------------------------

    res.cookie(
      "hireflow_token",
      token,
      getCookieOptions()
    );


    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      user:
        user.toJSON(),
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );


    // Duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }


    // Mongoose validation error
    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        ).map(
          (item) => item.message
        );

      return res.status(400).json({
        success: false,
        message:
          messages.join(", "),
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Registration failed. Please try again.",
    });
  }
};


// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;


    const cleanEmail =
      email?.trim().toLowerCase();


    // -------------------------------------------------
    // Validate input
    // -------------------------------------------------

    if (
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }


    // -------------------------------------------------
    // Find user
    // -------------------------------------------------

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select("+password");


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
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
    // Compare password
    // -------------------------------------------------

    const passwordMatch =
      await user.comparePassword(
        password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    // -------------------------------------------------
    // Update last login
    // -------------------------------------------------

    user.lastLogin =
      new Date();

    await user.save({
      validateBeforeSave: false,
    });


    // -------------------------------------------------
    // Generate JWT
    // -------------------------------------------------

    const token =
      generateToken(user._id);


    // -------------------------------------------------
    // Set cookie
    // -------------------------------------------------

    res.cookie(
      "hireflow_token",
      token,
      getCookieOptions()
    );


    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      user:
        user.toJSON(),
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed. Please try again.",
    });
  }
};


// =====================================================
// LOGOUT USER
// =====================================================

export const logoutUser = async (
  req,
  res
) => {
  try {
    res.cookie(
      "hireflow_token",
      "",
      {
        httpOnly: true,
        expires: new Date(0),
        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",

        path: "/",
      }
    );


    return res.status(200).json({
      success: true,
      message:
        "Logout successful",
    });

  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Logout failed",
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    return res.status(200).json({
      success: true,
      user:
        user.toJSON(),
    });

  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch current user",
    });
  }
};