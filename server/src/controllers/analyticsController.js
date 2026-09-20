import mongoose from "mongoose";

import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import Application from "../models/Application.js";
import OrganizationMember from "../models/OrganizationMember.js";

/*
|--------------------------------------------------------------------------
| Helper: Validate Organization
|--------------------------------------------------------------------------
*/

const validateOrganization = async (
  userId,
  organizationId
) => {
  if (!organizationId) {
    const error = new Error(
      "x-organization-id header is required"
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      organizationId
    )
  ) {
    const error = new Error(
      "Invalid organization ID"
    );

    error.statusCode = 400;

    throw error;
  }

  const membership =
    await OrganizationMember.findOne({
      user: userId,
      organization: organizationId,
      status: "active",
    });

  if (!membership) {
    const error = new Error(
      "You are not a member of this organization"
    );

    error.statusCode = 403;

    throw error;
  }

  return membership;
};

/*
|--------------------------------------------------------------------------
| GET DASHBOARD ANALYTICS
|--------------------------------------------------------------------------
*/

export const getDashboardAnalytics =
  async (req, res, next) => {
    try {
      const organizationId =
        req.headers["x-organization-id"];

      await validateOrganization(
        req.user._id,
        organizationId
      );

      /*
      |--------------------------------------------------------------------------
      | Basic Counts
      |--------------------------------------------------------------------------
      */

      const [
        totalJobs,
        activeJobs,
        totalCandidates,
        totalApplications,
      ] = await Promise.all([
        Job.countDocuments({
          organization: organizationId,
        }),

        Job.countDocuments({
          organization: organizationId,
          status: "open",
        }),

        Candidate.countDocuments({
          organization: organizationId,
        }),

        Application.countDocuments({
          organization: organizationId,
        }),
      ]);

      /*
      |--------------------------------------------------------------------------
      | Application Pipeline
      |--------------------------------------------------------------------------
      */

      const pipelineStatuses = [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ];

      const pipelineAggregation =
        await Application.aggregate([
          {
            $match: {
              organization:
                new mongoose.Types.ObjectId(
                  organizationId
                ),
            },
          },

          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      const pipeline = {};

      pipelineStatuses.forEach(
        (status) => {
          const result =
            pipelineAggregation.find(
              (item) =>
                item._id === status
            );

          pipeline[status] =
            result?.count || 0;
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Recent Applications
      |--------------------------------------------------------------------------
      */

      const recentApplications =
        await Application.find({
          organization: organizationId,
        })
          .populate(
            "candidate",
            "firstName lastName email"
          )
          .populate(
            "job",
            "title"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10)
          .lean();

      /*
      |--------------------------------------------------------------------------
      | Job Statistics
      |--------------------------------------------------------------------------
      */

      const jobStatistics =
        await Application.aggregate([
          {
            $match: {
              organization:
                new mongoose.Types.ObjectId(
                  organizationId
                ),
            },
          },

          {
            $group: {
              _id: "$job",
              applications: {
                $sum: 1,
              },

              selected: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "selected",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },

          {
            $sort: {
              applications: -1,
            },
          },

          {
            $limit: 10,
          },

          {
            $lookup: {
              from: "jobs",
              localField: "_id",
              foreignField: "_id",
              as: "job",
            },
          },

          {
            $unwind: {
              path: "$job",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 0,
              jobId: "$_id",
              title: "$job.title",
              applications: 1,
              selected: 1,
            },
          },
        ]);

      /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

      res.status(200).json({
        success: true,

        analytics: {
          overview: {
            totalJobs,
            activeJobs,
            totalCandidates,
            totalApplications,
            totalHired: pipeline.selected,
          },

          pipeline,

          recentApplications,

          jobStatistics,
        },
      });
    } catch (error) {
      next(error);
    }
  };