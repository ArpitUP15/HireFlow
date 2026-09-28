import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import Application from "../models/Application.js";


// ============================================================
// GET ADMIN PROFILE
// GET /api/admin/me
// ============================================================

export const getAdminProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    const admin = await User.findById(req.user._id).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error(
      "Get admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile.",
    });
  }
};


// ============================================================
// GET ADMIN DASHBOARD
// GET /api/admin/dashboard
// ============================================================

export const getAdminDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    const [
      totalUsers,
      totalOrganizations,
      totalJobs,
      totalCandidates,
      totalApplications,
    ] = await Promise.all([
      User.countDocuments(),

      Organization.countDocuments(),

      Job.countDocuments(),

      Candidate.countDocuments(),

      Application.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalOrganizations,
        totalJobs,
        totalCandidates,
        totalApplications,
      },
    });
  } catch (error) {
    console.error(
      "Get admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
    });
  }
};


// ============================================================
// GET ALL USERS
// GET /api/admin/users
// ============================================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};


// ============================================================
// GET USER BY ID
// GET /api/admin/users/:id
// ============================================================

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get user by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};


// ============================================================
// DELETE USER
// DELETE /api/admin/users/:id
// ============================================================

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent admin from deleting themselves
    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};


// ============================================================
// GET ALL ORGANIZATIONS
// GET /api/admin/organizations
// ============================================================

export const getAllOrganizations = async (
  req,
  res
) => {
  try {
    const organizations =
      await Organization.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    console.error(
      "Get all organizations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch organizations.",
    });
  }
};


// ============================================================
// GET ORGANIZATION BY ID
// GET /api/admin/organizations/:id
// ============================================================

export const getOrganizationById =
  async (req, res) => {
    try {
      const organization =
        await Organization.findById(
          req.params.id
        );

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found.",
        });
      }

      return res.status(200).json({
        success: true,
        organization,
      });
    } catch (error) {
      console.error(
        "Get organization by ID error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch organization.",
      });
    }
  };


// ============================================================
// DELETE ORGANIZATION
// DELETE /api/admin/organizations/:id
// ============================================================

export const deleteOrganization =
  async (req, res) => {
    try {
      const organization =
        await Organization.findById(
          req.params.id
        );

      if (!organization) {
        return res.status(404).json({
          success: false,
          message:
            "Organization not found.",
        });
      }

      await Organization.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Organization deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete organization error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete organization.",
      });
    }
  };


// ============================================================
// GET SYSTEM STATISTICS
// GET /api/admin/statistics
// ============================================================

export const getSystemStatistics =
  async (req, res) => {
    try {
      const [
        users,
        organizations,
        jobs,
        candidates,
        applications,
      ] = await Promise.all([
        User.countDocuments(),

        Organization.countDocuments(),

        Job.countDocuments(),

        Candidate.countDocuments(),

        Application.countDocuments(),
      ]);

      const applicationStats =
        await Application.aggregate([
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      return res.status(200).json({
        success: true,

        statistics: {
          users,
          organizations,
          jobs,
          candidates,
          applications,

          applicationsByStatus:
            applicationStats,
        },
      });
    } catch (error) {
      console.error(
        "Get system statistics error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch system statistics.",
      });
    }
  };
