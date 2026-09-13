import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";


// ==========================================
// CREATE APPLICATION
// ==========================================

export const createApplication = async (
  req,
  res
) => {
  try {
    const {
      job,
      candidate,
      source,
      coverLetter,
      recruiterNotes,
      rating,
    } = req.body;

    if (!job || !candidate) {
      return res.status(400).json({
        success: false,
        message:
          "Job and candidate are required",
      });
    }

    // Check job
    const jobExists = await Job.findOne({
      _id: job,
      organization: req.organization._id,
    });

    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check candidate
    const candidateExists =
      await Candidate.findOne({
        _id: candidate,
        organization:
          req.organization._id,
      });

    if (!candidateExists) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found",
      });
    }

    // Check duplicate application
    const existingApplication =
      await Application.findOne({
        organization:
          req.organization._id,

        job,

        candidate,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "Candidate has already applied for this job",
      });
    }

    const application =
      await Application.create({
        organization:
          req.organization._id,

        job,

        candidate,

        createdBy:
          req.user._id,

        source,

        coverLetter,

        recruiterNotes,

        rating,

        status: "applied",

        appliedAt: new Date(),

        lastStatusChangedAt:
          new Date(),
      });

    const populatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "job",
          "title department location status"
        )
        .populate(
          "candidate",
          "firstName lastName email phone skills experience"
        )
        .populate(
          "createdBy",
          "firstName lastName email"
        );

    return res.status(201).json({
      success: true,
      message:
        "Application created successfully",
      application:
        populatedApplication,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Candidate has already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create application",
    });
  }
};


// ==========================================
// GET ALL APPLICATIONS
// ==========================================

export const getApplications =
  async (req, res) => {
    try {
      const {
        status,
        job,
        candidate,
        search,
      } = req.query;

      const filter = {
        organization:
          req.organization._id,
      };

      if (status) {
        filter.status = status;
      }

      if (job) {
        filter.job = job;
      }

      if (candidate) {
        filter.candidate =
          candidate;
      }

      const applications =
        await Application.find(filter)
          .populate(
            "job",
            "title department location status"
          )
          .populate(
            "candidate",
            "firstName lastName email phone skills experience location"
          )
          .populate(
            "createdBy",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1,
          });

      let filteredApplications =
        applications;

      // Search populated candidate/job fields
      if (search) {
        const searchText =
          search.toLowerCase();

        filteredApplications =
          applications.filter(
            (application) => {
              const candidate =
                application.candidate;

              const job =
                application.job;

              const candidateName =
                `${candidate?.firstName || ""} ${
                  candidate?.lastName || ""
                }`.toLowerCase();

              const candidateEmail =
                (
                  candidate?.email ||
                  ""
                ).toLowerCase();

              const jobTitle =
                (
                  job?.title || ""
                ).toLowerCase();

              return (
                candidateName.includes(
                  searchText
                ) ||
                candidateEmail.includes(
                  searchText
                ) ||
                jobTitle.includes(
                  searchText
                )
              );
            }
          );
      }

      return res.status(200).json({
        success: true,
        count:
          filteredApplications.length,
        applications:
          filteredApplications,
      });
    } catch (error) {
      console.error(
        "Get applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch applications",
      });
    }
  };


// ==========================================
// GET APPLICATION BY ID
// ==========================================

export const getApplicationById =
  async (req, res) => {
    try {
      const application =
        await Application.findOne({
          _id: req.params.id,

          organization:
            req.organization._id,
        })
          .populate(
            "job",
            "title department description location employmentType experienceLevel salaryMin salaryMax status openings"
          )
          .populate(
            "candidate",
            "firstName lastName email phone location headline summary skills experience resumeUrl linkedinUrl portfolioUrl"
          )
          .populate(
            "createdBy",
            "firstName lastName email"
          );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        application,
      });
    } catch (error) {
      console.error(
        "Get application error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch application",
      });
    }
  };


// ==========================================
// UPDATE APPLICATION
// ==========================================

export const updateApplication =
  async (req, res) => {
    try {
      const allowedFields = [
        "source",
        "coverLetter",
        "recruiterNotes",
        "rating",
      ];

      const updates = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updates[field] =
              req.body[field];
          }
        }
      );

      const application =
        await Application.findOneAndUpdate(
          {
            _id: req.params.id,

            organization:
              req.organization._id,
          },

          updates,

          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "job",
            "title department location status"
          )
          .populate(
            "candidate",
            "firstName lastName email skills experience"
          );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application updated successfully",
        application,
      });
    } catch (error) {
      console.error(
        "Update application error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update application",
      });
    }
  };


// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

export const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const validStatuses = [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ];

      if (
        !validStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status",
        });
      }

      const application =
        await Application.findOneAndUpdate(
          {
            _id: req.params.id,

            organization:
              req.organization._id,
          },

          {
            status,

            lastStatusChangedAt:
              new Date(),
          },

          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "job",
            "title department"
          )
          .populate(
            "candidate",
            "firstName lastName email"
          );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application status updated successfully",

        application,
      });
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update application status",
      });
    }
  };


// ==========================================
// DELETE APPLICATION
// ==========================================

export const deleteApplication =
  async (req, res) => {
    try {
      const application =
        await Application.findOneAndDelete(
          {
            _id: req.params.id,

            organization:
              req.organization._id,
          }
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete application error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete application",
      });
    }
  };


// ==========================================
// GET APPLICATIONS FOR A JOB
// ==========================================

export const getJobApplications =
  async (req, res) => {
    try {
      const job =
        await Job.findOne({
          _id: req.params.jobId,

          organization:
            req.organization._id,
        });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      const applications =
        await Application.find({
          job: job._id,

          organization:
            req.organization._id,
        })
          .populate(
            "candidate",
            "firstName lastName email phone location skills experience headline"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count:
          applications.length,
        applications,
      });
    } catch (error) {
      console.error(
        "Job applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch job applications",
      });
    }
  };


// ==========================================
// GET APPLICATIONS FOR CANDIDATE
// ==========================================

export const getCandidateApplications =
  async (req, res) => {
    try {
      const candidate =
        await Candidate.findOne({
          _id: req.params.candidateId,

          organization:
            req.organization._id,
        });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found",
        });
      }

      const applications =
        await Application.find({
          candidate:
            candidate._id,

          organization:
            req.organization._id,
        })
          .populate(
            "job",
            "title department location status"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count:
          applications.length,
        applications,
      });
    } catch (error) {
      console.error(
        "Candidate applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch candidate applications",
      });
    }
  };


// ==========================================
// RECRUITMENT PIPELINE
// ==========================================

export const getRecruitmentPipeline =
  async (req, res) => {
    try {
      const pipeline =
        await Application.aggregate([
          {
            $match: {
              organization:
                req.organization
                  ._id,
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

      const statuses = [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ];

      const result =
        statuses.map(
          (status) => {
            const found =
              pipeline.find(
                (item) =>
                  item._id ===
                  status
              );

            return {
              status,

              count:
                found?.count || 0,
            };
          }
        );

      return res.status(200).json({
        success: true,
        pipeline: result,
      });
    } catch (error) {
      console.error(
        "Pipeline error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch recruitment pipeline",
      });
    }
  };