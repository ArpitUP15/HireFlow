import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// --------------------------------------
// Register
// --------------------------------------

export const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {
    res.status(400);

    throw new Error(
      "First name, last name, email and password are required"
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase()
  });

  if (existingUser) {
    res.status(409);

    throw new Error(
      "An account with this email already exists"
    );
  }

  // Never allow public users to create privileged accounts.
  const allowedRoles = ["candidate", "recruiter"];

  const userRole = allowedRoles.includes(role)
    ? role
    : "candidate";

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: userRole
  });

  if (!user) {
    res.status(400);

    throw new Error("Unable to create user");
  }

  const token = generateToken(user._id);

  res.cookie("hireflow_token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: user.toJSON()
  });
};

// --------------------------------------
// Login
// --------------------------------------

export const loginUser = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    res.status(400);

    throw new Error(
      "Email and password are required"
    );
  }

  const user = await User.findOne({
    email: email.toLowerCase()
  }).select("+password");

  if (!user) {
    res.status(401);

    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);

    throw new Error(
      "Your account has been deactivated"
    );
  }

  const passwordMatch =
    await user.comparePassword(password);

  if (!passwordMatch) {
    res.status(401);

    throw new Error("Invalid email or password");
  }

  user.lastLogin = new Date();

  await user.save({
    validateBeforeSave: false
  });

  const token = generateToken(user._id);

  res.cookie(
    "hireflow_token",
    token,
    cookieOptions
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: user.toJSON()
  });
};

// --------------------------------------
// Logout
// --------------------------------------

export const logoutUser = async (req, res) => {
  res.cookie("hireflow_token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax"
  });

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};

// --------------------------------------
// Get current user
// --------------------------------------

export const getCurrentUser = async (
  req,
  res
) => {
  const user = await User.findById(
    req.user._id
  );

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user: user.toJSON()
  });
};