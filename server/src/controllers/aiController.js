import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import { analyzeResume } from "../services/aiService.js";

export const screenCandidate = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const candidate =
      await Candidate.findOne({
        _id: req.params.candidateId,
        organization: organizationId,
      });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!candidate.resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate does not have a readable resume",
      });
    }

    const job = await Job.findOne({
      _id: req.body.jobId,
      organization: organizationId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const result = await analyzeResume({
      resumeText: candidate.resumeText,
      jobDescription:
        job.description || "",
    });

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};