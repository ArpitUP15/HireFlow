import OrganizationMember from "../models/OrganizationMember.js";

// ------------------------------------------------
// Attach organization to request
// ------------------------------------------------

export const organizationMiddleware = async (req, res, next) => {
  try {
    const organizationId = req.headers["x-organization-id"];

    if (!organizationId) {
      res.status(400);
      throw new Error("x-organization-id header is required");
    }

    const member = await OrganizationMember.findOne({
      organization: organizationId,
      user: req.user._id,
      status: "active",
    }).populate("organization");

    if (!member) {
      res.status(403);
      throw new Error("You are not a member of this organization");
    }

    req.organization = member.organization;
    req.organizationMember = member;

    next();
  } catch (error) {
    next(error);
  }
};

export const loadOrganization = organizationMiddleware;

// ------------------------------------------------
// Organization role authorization
// ------------------------------------------------

export const requireOrganizationRole = (...roles) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      res.status(403);
      return next(new Error("Organization membership required"));
    }

    if (!roles.includes(req.organizationMember.role)) {
      res.status(403);
      return next(new Error("You do not have the required organization role"));
    }

    next();
  };
};

// ------------------------------------------------
// Permission authorization
// ------------------------------------------------

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      res.status(403);
      return next(new Error("Organization membership required"));
    }

    const hasPermission = req.organizationMember.permissions?.[permission];

    if (
      req.organizationMember.role === "owner" ||
      req.organizationMember.role === "hr_admin"
    ) {
      return next();
    }

    if (!hasPermission) {
      res.status(403);
      return next(new Error(`Missing permission: ${permission}`));
    }

    next();
  };
};