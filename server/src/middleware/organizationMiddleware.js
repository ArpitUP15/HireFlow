import mongoose from "mongoose";

import OrganizationMember from "../models/OrganizationMember.js";


// =====================================================
// ORGANIZATION MIDDLEWARE
// =====================================================

export const organizationMiddleware =
  async (req, res, next) => {
    try {

      let organizationId =
        req.headers[
          "x-organization-id"
        ];


      // -------------------------------------------------
      // If no organization ID was sent,
      // automatically use the user's first active
      // organization.
      // -------------------------------------------------

      if (!organizationId) {

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


        // -----------------------------------------------
        // User has no organization
        // -----------------------------------------------

        if (!firstMembership) {

          res.status(404);

          throw new Error(
            "No organization found. Please create or join an organization first."
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

        res.status(400);

        throw new Error(
          "Invalid organization ID"
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

        res.status(403);

        throw new Error(
          "You are not a member of this organization"
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