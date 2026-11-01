import { z } from "zod";

const stringArray = {
  type: "array",
  items: { type: "string" },
};

const field = (properties) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const evidenceSchema = field({
  requirement: { type: "string" },
  status: {
    type: "string",
    enum: ["met", "partial", "not_evidenced"],
  },
  evidence: { type: "string" },
});

export const resumeSchema = field({
  name: { type: "string" },
  email: { type: "string" },
  phone: { type: "string" },
  skills: stringArray,
  education: stringArray,
  experience: stringArray,
  projects: stringArray,
  certifications: stringArray,
  summary: { type: "string" },
});

export const screeningSchema = field({
  summary: { type: "string" },
  matchedQualifications: stringArray,
  missingEvidence: stringArray,
  concernsToVerify: stringArray,
  strengths: stringArray,
  recommendation: {
    type: "string",
    enum: ["review", "needs_more_information"],
  },
});

export const matchSchema = field({
  requirements: {
    type: "array",
    items: evidenceSchema,
  },
  matchedSkills: stringArray,
  missingEvidence: stringArray,
  explanation: { type: "string" },
});

export const interviewSchema = field({
  questions: {
    type: "array",
    items: field({
      question: { type: "string" },
      category: {
        type: "string",
        enum: ["technical", "behavioral", "scenario"],
      },
      difficulty: {
        type: "string",
        enum: ["easy", "medium", "hard"],
      },
      evaluationGuide: { type: "string" },
    }),
  },
});

export const schemas = {
  resume: resumeSchema,
  screening: screeningSchema,
  matching: matchSchema,
  interview: interviewSchema,
};

// Runtime shape checking adds defense in depth.
export const validators = {
  resume: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      skills: z.array(z.string()),
      education: z.array(z.string()),
      experience: z.array(z.string()),
      projects: z.array(z.string()),
      certifications: z.array(z.string()),
      summary: z.string(),
    })
    .strict(),

  screening: z
    .object({
      summary: z.string(),
      matchedQualifications: z.array(z.string()),
      missingEvidence: z.array(z.string()),
      concernsToVerify: z.array(z.string()),
      strengths: z.array(z.string()),
      recommendation: z.enum(["review", "needs_more_information"]),
    })
    .strict(),

  matching: z
    .object({
      requirements: z.array(
        z
          .object({
            requirement: z.string(),
            status: z.enum(["met", "partial", "not_evidenced"]),
            evidence: z.string(),
          })
          .strict(),
      ),
      matchedSkills: z.array(z.string()),
      missingEvidence: z.array(z.string()),
      explanation: z.string(),
    })
    .strict(),

  interview: z
    .object({
      questions: z.array(
        z
          .object({
            question: z.string(),
            category: z.enum(["technical", "behavioral", "scenario"]),
            difficulty: z.enum(["easy", "medium", "hard"]),
            evaluationGuide: z.string(),
          })
          .strict(),
      ),
    })
    .strict(),
};
