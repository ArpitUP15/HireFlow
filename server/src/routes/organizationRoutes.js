import express from "express";

import {
  createOrganization,
  getOrganization,
  getMyOrganizations,
  updateOrganization,
  getMembers,
  inviteMember,
  acceptInvitation,
  removeMember,
  updateMemberRole,
} from "../controllers/organisationController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  loadOrganization,
  requireOrganizationRole,
  requirePermission,
} from "../middleware/organizationMiddleware.js";


const router =
  express.Router();


// =====================================================
// CREATE ORGANIZATION
// =====================================================

router.post(
  "/",
  protect,
  createOrganization
);


// =====================================================
// GET MY ORGANIZATIONS
// =====================================================

router.get(
  "/my",
  protect,
  getMyOrganizations
);


// =====================================================
// CURRENT ORGANIZATION
// =====================================================

router.get(
  "/current",
  protect,
  loadOrganization,
  getOrganization
);


// =====================================================
// UPDATE CURRENT ORGANIZATION
// =====================================================

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


// =====================================================
// MEMBERS
// =====================================================

router.get(
  "/members",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  getMembers
);


// =====================================================
// INVITATIONS
// =====================================================

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


// =====================================================
// UPDATE MEMBER ROLE
// =====================================================

router.patch(
  "/members/:memberId/role",
  protect,
  loadOrganization,
  requirePermission(
    "manageMembers"
  ),
  updateMemberRole
);


// =====================================================
// REMOVE MEMBER
// =====================================================

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