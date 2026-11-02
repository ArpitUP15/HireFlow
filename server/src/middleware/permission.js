const normalizeRoles = (...values) => {
  const flattened = values.flat();

  return flattened.filter(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
};

const sendForbidden = (res, message) => {
  if (res && typeof res.status === "function") {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  const error = new Error(message);
  error.status = 403;

  return error;
};

export const hasUserRole = (user, ...roles) => {
  const allowedRoles = normalizeRoles(roles);

  if (!user?.role || !allowedRoles.length) {
    return false;
  }

  return allowedRoles.includes(user.role);
};

export const hasOrganizationRole = (organizationMember, ...roles) => {
  const allowedRoles = normalizeRoles(roles);

  if (!organizationMember?.role || !allowedRoles.length) {
    return false;
  }

  return allowedRoles.includes(organizationMember.role);
};

export const hasPermission = (organizationMember, permission) => {
  if (!organizationMember) {
    return false;
  }

  if (
    organizationMember.role === "owner" ||
    organizationMember.role === "hr_admin"
  ) {
    return true;
  }

  return Boolean(organizationMember.permissions?.[permission]);
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbidden(res, "Authentication required");
    }

    const allowedRoles = normalizeRoles(roles);

    if (!allowedRoles.length) {
      return next(new Error("No roles were configured for this route"));
    }

    if (!hasUserRole(req.user, ...allowedRoles)) {
      return sendForbidden(
        res,
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};

export const authorize = requireRole;

export const requireOrganizationRole = (...roles) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      return sendForbidden(res, "Organization membership required");
    }

    const allowedRoles = normalizeRoles(roles);

    if (!allowedRoles.length) {
      return next(new Error("No organization roles were configured for this route"));
    }

    if (!hasOrganizationRole(req.organizationMember, ...allowedRoles)) {
      return sendForbidden(
        res,
        "You do not have the required organization role",
      );
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      return sendForbidden(res, "Organization membership required");
    }

    if (!hasPermission(req.organizationMember, permission)) {
      return sendForbidden(
        res,
        `Missing permission: ${permission}`,
      );
    }

    next();
  };
};

export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      return sendForbidden(res, "Organization membership required");
    }

    const requiredPermissions = normalizeRoles(permissions);

    if (!requiredPermissions.length) {
      return next(
        new Error("No permissions were configured for this route"),
      );
    }

    const hasAnyPermission = requiredPermissions.some((perm) =>
      hasPermission(req.organizationMember, perm),
    );

    if (!hasAnyPermission) {
      return sendForbidden(
        res,
        `Missing required permission. Needed one of: ${requiredPermissions.join(", ")}`,
      );
    }

    next();
  };
};

export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      return sendForbidden(res, "Organization membership required");
    }

    const requiredPermissions = normalizeRoles(permissions);

    if (!requiredPermissions.length) {
      return next(
        new Error("No permissions were configured for this route"),
      );
    }

    const missingPermissions = requiredPermissions.filter(
      (perm) => !hasPermission(req.organizationMember, perm),
    );

    if (missingPermissions.length) {
      return sendForbidden(
        res,
        `Missing permissions: ${missingPermissions.join(", ")}`,
      );
    }

    next();
  };
};

const permissionMiddleware = {
  requireRole,
  authorize,
  requireOrganizationRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  hasUserRole,
  hasOrganizationRole,
  hasPermission,
};

export default permissionMiddleware;