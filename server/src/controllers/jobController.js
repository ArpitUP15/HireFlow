const Job = require("../models/JOb");


// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      description,
      requirements,
      responsibilities,
      skills,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      applicationDeadline,
      openings,
      status,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message:
          "Title and description are required",
      });
    }

    const job = await Job.create({
      organization:
        req.organization._id,

      createdBy: req.user._id,

      title,
      department,
      description,
      requirements,
      responsibilities,
      skills,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      applicationDeadline,
      openings,
      status,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
};


// GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    const {
      status,
      search,
      department,
    } = req.query;

    const filter = {
      organization:
        req.organization._id,
    };

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const jobs = await Job.find(filter)
      .populate(
        "createdBy",
        "firstName lastName email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};


// GET SINGLE JOB
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      organization:
        req.organization._id,
    }).populate(
      "createdBy",
      "firstName lastName email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};


// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const job =
      await Job.findOneAndUpdate(
        {
          _id: req.params.id,
          organization:
            req.organization._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
};


// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const job =
      await Job.findOneAndDelete({
        _id: req.params.id,
        organization:
          req.organization._id,
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
};


// PUBLISH JOB
const publishJob = async (req, res) => {
  try {
    const job =
      await Job.findOneAndUpdate(
        {
          _id: req.params.id,
          organization:
            req.organization._id,
        },
        {
          status: "published",
        },
        {
          new: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job published successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to publish job",
    });
  }
};


// CLOSE JOB
const closeJob = async (req, res) => {
  try {
    const job =
      await Job.findOneAndUpdate(
        {
          _id: req.params.id,
          organization:
            req.organization._id,
        },
        {
          status: "closed",
        },
        {
          new: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to close job",
    });
  }
};


module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  publishJob,
  closeJob,
};