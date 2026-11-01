import { z } from "zod";
import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import AIInsight from "../models/AIInsight.js";
import { GROQ_MODEL } from "../config/groq.js";
import { extractResumeText } from "../services/resumeParser.js";
import {
  parseResumeAI,
  screenCandidate,
  matchCandidate,
  generateInterviewQuestions,
} from "../services/groqService.js";
const text = z.string().trim().min(10).max(18000);
const comparison = z.object({ resumeText: text, jobDescription: text });
const questions = z.object({
  jobDescription: text,
  resumeText: z.string().max(18000).default(""),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  count: z.coerce.number().int().min(1).max(10).default(5),
});
const fail = (status, message) => Object.assign(new Error(message), { status });
async function documents(req) {
  const candidateId = req.params.candidateId || req.body.candidateId;
  const jobId = req.body.jobId;
  if (![candidateId, jobId].every(mongoose.isValidObjectId))
    throw fail(400, "Valid candidateId and jobId are required");
  const organization = req.organization._id;
  const [candidate, job] = await Promise.all([
    Candidate.findOne({ _id: candidateId, organization }),
    Job.findOne({ _id: jobId, organization }),
  ]);
  if (!candidate || !job)
    throw fail(404, "Candidate or job not found in this organization");
  return {
    candidate,
    job,
    resumeText: candidate.resumeText,
    jobDescription: job.description,
  };
}
function errorResponse(res, error) {
  if (error instanceof z.ZodError)
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid request data",
        issues: error.issues,
      });
  let status = error.status || 502;
  if (status === 401 || status === 403) status = 503;
  if (error.name === "APIConnectionTimeoutError") status = 504;
  const message =
    status === 429
      ? "AI rate limit reached. Please try again later."
      : status === 503
        ? "Configure your real GROQ_API_KEY in server/.env and restart the backend."
        : status === 504
          ? "AI request timed out. Please retry."
          : status === 400 || status === 404
            ? error.message
            : "AI processing failed. Please retry.";
  return res.status(status).json({ success: false, message });
}
export const processAI =
  (type, stored = false) =>
  async (req, res) => {
    let candidate, job;
    try {
      let data;
      if (type === "resume") {
        const resumeText = await extractResumeText(req.file);
        if (req.body.candidateId) {
          if (!mongoose.isValidObjectId(req.body.candidateId))
            throw fail(400, "Invalid candidateId");
          candidate = await Candidate.findOne({
            _id: req.body.candidateId,
            organization: req.organization._id,
          });
          if (!candidate) throw fail(404, "Candidate not found");
        }
        data = await parseResumeAI(resumeText);
        if (candidate) {
          candidate.resumeText = resumeText;
          candidate.parsedResume = data;
          await candidate.save();
        }
      } else {
        let input = req.body;
        if (stored || req.body.candidateId) {
          const docs = await documents(req);
          candidate = docs.candidate;
          job = docs.job;
          input = {
            ...req.body,
            resumeText: docs.resumeText || "",
            jobDescription: docs.jobDescription,
          };
        }
        if (type === "interview") {
          input = questions.parse(input);
          data = await generateInterviewQuestions(input);
          if (data.questions.length !== input.count)
            throw fail(502, "Invalid question count");
        } else {
          input = comparison.parse(input);
          data = await (
            type === "screening" ? screenCandidate : matchCandidate
          )(input.resumeText, input.jobDescription);
        }
      }
      const record = await AIInsight.create({
        organization: req.organization._id,
        user: req.user._id,
        candidate: candidate?._id,
        job: job?._id,
        type,
        status: "succeeded",
        model: GROQ_MODEL,
        result: data,
      });
      return res.json({
        success: true,
        data,
        result: data,
        insightId: record._id,
        analyzedAt: record.createdAt,
      });
    } catch (error) {
      // Audit metadata only on failures: never persist prompts, raw resumes, or provider error bodies.
      await AIInsight.create({
        organization: req.organization._id,
        user: req.user._id,
        candidate: candidate?._id,
        job: job?._id,
        type,
        status: "failed",
        model: GROQ_MODEL,
        errorCode: String(error.status || "PROCESSING_ERROR"),
      }).catch(() => {});
      return errorResponse(res, error);
    }
  };
export async function history(req, res, next) {
  try {
    const filter = { organization: req.organization._id };
    for (const key of ["candidate", "job"])
      if (req.query[key]) {
        if (!mongoose.isValidObjectId(req.query[key]))
          throw fail(400, "Invalid record ID");
        filter[key] = req.query[key];
      }
    const records = await AIInsight.find(filter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    res.json({ success: true, data: records });
  } catch (e) {
    if (e.status) return errorResponse(res, e);
    next(e);
  }
}
export async function metrics(req, res, next) {
  try {
    const data = await AIInsight.aggregate([
      { $match: { organization: req.organization._id } },
      {
        $group: {
          _id: { type: "$type", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
