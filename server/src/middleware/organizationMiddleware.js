import mongoose from "mongoose";

import OrganizationMember from "../models/OrganizationMember.js";


// =====================================================
// ORGANIZATION MIDDLEWARE
// =====================================================

export const organizationMiddleware =
  async (req, res, next) => {
    try {

      if (req.user?.role === "candidate") {
        req.organization = null;
        req.organizationMember = null;
        return next();
      }

      let organizationId =
        req.headers[
          "x-organization-id"
        ];

      const firstMembership =
        await OrganizationMember.findOne({
          user: req.user._id,
          status: "active",
        })
          .sort({
            createdAt: 1,
          })
          .populate(
            "organization"
          );


      // -------------------------------------------------
      // If no organization ID was sent,
      // automatically use the user's first active
      // organization.
      // -------------------------------------------------

      if (!organizationId) {

        if (!firstMembership) {
          if (typeof res?.status === "function") {
            res.status(404);
          }
          return next(
            new Error(
              "No organization found. Please create or join an organization first."
            )
          );
        }

        req.organization =
          firstMembership.organization;
        req.organizationMember =
          firstMembership;
        return next();
      }


      // -------------------------------------------------
      // Validate MongoDB ObjectId
      // -------------------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(
          organizationId
        )
      ) {
        if (firstMembership) {
          req.organization =
            firstMembership.organization;
          req.organizationMember =
            firstMembership;
          return next();
        }

        if (typeof res?.status === "function") {
          res.status(404);
        }
        return next(
          new Error(
            "No organization found. Please create or join an organization first."
          )
        );
      }


      // -------------------------------------------------
      // Find organization membership
      // -------------------------------------------------

      const member =
        await OrganizationMember.findOne({
          organization:
            organizationId,

          user:
            req.user._id,

          status: "active",
        }).populate(
          "organization"
        );


      if (!member) {
        if (firstMembership) {
          req.organization =
            firstMembership.organization;
          req.organizationMember =
            firstMembership;
          return next();
        }

        if (typeof res?.status === "function") {
          res.status(404);
        }
        return next(
          new Error(
            "No organization found. Please create or join an organization first."
          )
        );
      }


      // -------------------------------------------------
      // Attach organization information
      // -------------------------------------------------

      req.organization =
        member.organization;

      req.organizationMember =
        member;


      next();

    } catch (error) {

      next(error);
    }
  };


// =====================================================
// ALIAS
// =====================================================

export const loadOrganization =
  organizationMiddleware;

export default organizationMiddleware;

// =====================================================
// ROLE AUTHORIZATION
// =====================================================

export const requireOrganizationRole =
  (...roles) => {

    return (
      req,
      res,
      next
    ) => {

      if (
        !req.organizationMember
      ) {

        res.status(403);

        return next(
          new Error(
            "Organization membership required"
          )
        );
      }


      if (
        !roles.includes(
          req.organizationMember.role
        )
      ) {

        res.status(403);

        return next(
          new Error(
            "You do not have the required organization role"
          )
        );
      }


      next();
    };
  };


// =====================================================
// PERMISSION AUTHORIZATION
// =====================================================

export const requirePermission =
  (permission) => {

    return (
      req,
      res,
      next
    ) => {

      if (
        !req.organizationMember
      ) {

        res.status(403);

        return next(
          new Error(
            "Organization membership required"
          )
        );
      }


      // Owner and HR admin have
      // all organization permissions.

      if (
        req.organizationMember.role ===
          "owner" ||
        req.organizationMember.role ===
          "hr_admin"
      ) {

        return next();
      }


      const hasPermission =
        Boolean(
          req.organizationMember
            .permissions?.[
            permission
          ]
        );


      if (!hasPermission) {

        res.status(403);

        return next(
          new Error(
            `Missing permission: ${permission}`
          )
        );
      }


      next();
    };
  };