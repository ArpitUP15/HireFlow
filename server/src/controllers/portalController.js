import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Organization from "../models/Organization.js";
import mongoose from "mongoose";

const PROFILE_STRING_FIELDS = {
  firstName: 50,
  lastName: 50,
  phone: 30,
  location: 200,
  address: 500,
  headline: 200,
  summary: 5000,
  education: 3000,
  linkedinUrl: 1000,
  githubUrl: 1000,
  portfolioUrl: 1000,
};

const serializeProfile = (user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  ...user.candidateProfile.toObject(),
  resume: user.candidateProfile.resume?.fileName
    ? {
        originalName: user.candidateProfile.resume.originalName,
        fileName: user.candidateProfile.resume.fileName,
        uploadedAt: user.candidateProfile.resume.uploadedAt,
      }
    : null,
});

const getQueryString = (value) =>
  typeof value === "string" ? value.trim() : "";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPortalJobs = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const page =
      Number.isSafeInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit =
      Number.isSafeInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 15;
    const queryFields = [
      "search",
      "location",
      "employmentType",
      "experienceLevel",
      "department",
      "skill",
    ];

    if (
      queryFields.some(
        (field) =>
          req.query[field] !== undefined &&
          typeof req.query[field] !== "string",
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job search filters",
      });
    }

    const activeOrganizations = await Organization.find({
      isActive: true,
    }).select("_id");
    const filter = {
      status: "published",
      organization: { $in: activeOrganizations.map(({ _id }) => _id) },
    };
    const search = getQueryString(req.query.search);
    const location = getQueryString(req.query.location);
    const employmentType = getQueryString(req.query.employmentType);
    const experienceLevel = getQueryString(req.query.experienceLevel);
    const department = getQueryString(req.query.department);
    const skill = getQueryString(req.query.skill);

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { department: searchRegex },
        { skills: searchRegex },
      ];
    }
    if (location) {
      filter.location = new RegExp(escapeRegex(location), "i");
    }
    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (department) {
      filter.department = new RegExp(escapeRegex(department), "i");
    }
    if (skill) {
      filter.skills = new RegExp(escapeRegex(skill), "i");
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("organization", "name logo")
        .sort({ updatedAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Get candidate portal jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const applyToPortalJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }
    if (
      req.body !== undefined &&
      (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid application data",
      });
    }
    if (
      req.body?.coverLetter !== undefined &&
      (typeof req.body.coverLetter !== "string" ||
        req.body.coverLetter.length > 10000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Cover letter must be 10,000 characters or fewer",
      });
    }

    const [job, user] = await Promise.all([
      Job.findOne({ _id: id, status: "published" }).populate("organization"),
      User.findById(req.user._id).select("+candidateProfile"),
    ]);
    if (!job || !job.organization?.isActive) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let candidate = await Candidate.findOne({
      organization: job.organization._id,
      email: user.email,
    });
    if (!candidate) {
      candidate = await Candidate.create({
        organization: job.organization._id,
        createdBy: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.candidateProfile.phone,
        location: user.candidateProfile.location,
        skills: user.candidateProfile.skills,
        experience: user.candidateProfile.experience,
        education: user.candidateProfile.education,
        address: user.candidateProfile.address,
        headline: user.candidateProfile.headline,
        summary: user.candidateProfile.summary,
        linkedinUrl: user.candidateProfile.linkedinUrl,
        githubUrl: user.candidateProfile.githubUrl,
        portfolioUrl: user.candidateProfile.portfolioUrl,
      });
    }

    const profileResume = user.candidateProfile.resume;
    if (profileResume?.filePath && !candidate.resume?.filePath) {
      const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || "uploads");
      const candidateResumePath = path.join(
        uploadDirectory,
        `${randomUUID()}.pdf`,
      );
      await fs.copyFile(
        profileResume.filePath,
        candidateResumePath,
        fsConstants.COPYFILE_EXCL,
      );
      candidate.resume = {
        originalName: profileResume.originalName,
        fileName: path.basename(candidateResumePath),
        filePath: candidateResumePath,
        mimeType: "application/pdf",
        uploadedAt: profileResume.uploadedAt,
      };
      candidate.resumeFileName = profileResume.originalName;
      try {
        await candidate.save();
      } catch (error) {
        try {
          await fs.unlink(candidateResumePath);
        } catch (cleanupError) {
          if (cleanupError.code !== "ENOENT") {
            console.error("Could not remove incomplete application resume:", cleanupError);
          }
        }
        throw error;
      }
    }

    const application = await Application.create({
      organization: job.organization._id,
      job: job._id,
      candidate: candidate._id,
      createdBy: user._id,
      coverLetter: req.body?.coverLetter || "",
      source: "website",
      status: "applied",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    console.error("Submit candidate portal application error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+candidateProfile");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: serializeProfile(user),
      email: user.email,
    });
  } catch (error) {
    console.error("Get candidate portal profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data",
      });
    }

    for (const [field, maxLength] of Object.entries(PROFILE_STRING_FIELDS)) {
      if (
        body[field] !== undefined &&
        (typeof body[field] !== "string" ||
          body[field].length > maxLength)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${field}`,
        });
      }
    }

    if (
      body.skills !== undefined &&
      (!Array.isArray(body.skills) ||
        body.skills.length > 100 ||
        body.skills.some(
          (skill) => typeof skill !== "string" || skill.length > 100,
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Skills must be a list of up to 100 text values",
      });
    }

    if (
      body.experience !== undefined &&
      (!Number.isFinite(body.experience) ||
        body.experience < 0 ||
        body.experience > 70)
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience must be between 0 and 70",
      });
    }

    const user = await User.findById(req.user._id).select("+candidateProfile");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (body.firstName !== undefined) user.firstName = body.firstName.trim();
    if (body.lastName !== undefined) user.lastName = body.lastName.trim();

    for (const field of Object.keys(PROFILE_STRING_FIELDS)) {
      if (field !== "firstName" && field !== "lastName" && body[field] !== undefined) {
        user.candidateProfile[field] = body[field].trim();
      }
    }
    if (body.skills !== undefined) {
      user.candidateProfile.skills = body.skills.map((skill) => skill.trim());
    }
    if (body.experience !== undefined) {
      user.candidateProfile.experience = body.experience;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile saved",
      profile: serializeProfile(user),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Update candidate portal profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
};

export const uploadMyResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume file is required",
    });
  }
  if (!req.file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    return res.status(400).json({
      success: false,
      message: "The uploaded file is not a valid PDF",
    });
  }

  let filePath;
  try {
    const user = await User.findById(req.user._id).select("+candidateProfile");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || "uploads");
    await fs.mkdir(uploadDirectory, { recursive: true });
    filePath = path.join(uploadDirectory, `${randomUUID()}.pdf`);
    await fs.writeFile(filePath, req.file.buffer, { flag: "wx", mode: 0o600 });

    const previousPath = user.candidateProfile.resume?.filePath;
    user.candidateProfile.resume = {
      originalName: path.basename(req.file.originalname),
      fileName: path.basename(filePath),
      filePath,
      mimeType: "application/pdf",
      uploadedAt: new Date(),
    };
    await user.save();

    if (previousPath) {
      try {
        await fs.unlink(previousPath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Could not remove replaced candidate resume:", error);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      profile: serializeProfile(user),
    });
  } catch (error) {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          console.error("Could not remove incomplete candidate resume:", cleanupError);
        }
      }
    }
    console.error("Upload candidate portal resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

export const downloadMyResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+candidateProfile");
    const resume = user?.candidateProfile?.resume;
    if (!resume?.filePath) {
      return res.status(404).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    await fs.access(resume.filePath);
    return res.download(
      resume.filePath,
      path.basename(resume.originalName || "resume.pdf"),
      (error) => {
        if (error && !res.headersSent) {
          console.error("Download candidate portal resume error:", error);
          res.status(500).json({
            success: false,
            message: "Failed to download resume",
          });
        }
      },
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }
    console.error("Download candidate portal resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download resume",
    });
  }
};

const APPLICATION_STATUSES = [
  "applied",
  "screening",
  "shortlisted",
  "interview",
  "selected",
  "rejected",
];

export const getMyApplications = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const page =
      Number.isSafeInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit =
      Number.isSafeInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 15;
    const rawStatus = req.query.status;

    if (rawStatus !== undefined && typeof rawStatus !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const status = rawStatus?.trim();

    if (status && !APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const candidates = await Candidate.find({
      email: req.user.email,
    }).select("_id");
    const candidateIds = candidates.map((candidate) => candidate._id);
    const candidateFilter = { candidate: { $in: candidateIds } };
    const applicationFilter = status
      ? { ...candidateFilter, status }
      : candidateFilter;

    const [applications, total, statusCounts] = await Promise.all([
      Application.find(applicationFilter)
        .populate("job", "title department location")
        .populate("organization", "name")
        .sort({ appliedAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Application.countDocuments(applicationFilter),
      Application.aggregate([
        { $match: candidateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = Object.fromEntries(
      APPLICATION_STATUSES.map((applicationStatus) => [
        applicationStatus,
        0,
      ]),
    );
    for (const entry of statusCounts) {
      counts[entry._id] = entry.count;
    }

    return res.status(200).json({
      success: true,
      applications,
      counts,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Get candidate portal applications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};
