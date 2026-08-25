import express from "express";

import {
  createOrganization,
  getOrganization,
  updateOrganization,
  getMembers,
  inviteMember,
  acceptInvitation,
  removeMember,
  updateMemberRole
} from "../controllers/organisationController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  loadOrganization,
  requireOrganizationRole,
  requirePermission
} from "../middleware/organizationMiddleware.js";

const router =
  express.Router();

// =================================================
// Organization creation
// =================================================

router.post(
  "/",
  protect,
  createOrganization
);

// =================================================
// Organization profile
// =================================================

router.get(
  "/current",
  protect,
  loadOrganization,
  getOrganization
);

router.put(
  "/current",
  protect,
  loadOrganization,
  requireOrganizationRole(
    "owner",
    "hr_admin"
  ),
  updateOrganization
);

// =================================================
// Members
// =================================================

router.get(
  "/members",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  getMembers
);

// =================================================
// Invitations
// =================================================

router.post(
  "/invite",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  inviteMember
);

router.post(
  "/accept-invitation",
  protect,
  acceptInvitation
);

// =================================================
// Member management
// =================================================

router.patch(
  "/members/:memberId/role",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  updateMemberRole
);

router.delete(
  "/members/:memberId",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  removeMember
);

export default router;