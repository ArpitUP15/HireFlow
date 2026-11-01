import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import OrganizationMember from "../src/models/OrganizationMember.js";
import Organization from "../src/models/Organization.js";
import Job from "../src/models/Job.js";
import Application from "../src/models/Application.js";
import Candidate from "../src/models/Candidate.js";
import AIInsight from "../src/models/AIInsight.js";
import { extractResumeText } from "../src/services/resumeParser.js";
import { validators } from "../src/utils/aiSchemas.js";
const uid = new mongoose.Types.ObjectId(),
  org = new mongoose.Types.ObjectId();
const candidate = new mongoose.Types.ObjectId(),
  job = new mongoose.Types.ObjectId();
process.env.JWT_SECRET = "integration-test-secret";
const cookie = `hireflow_token=${jwt.sign({ userId: String(uid) }, process.env.JWT_SECRET)}`;
function auth(role = "owner") {
  mock.method(User, "findById", async () => ({
    _id: uid,
    isActive: true,
    role: role === "candidate" ? role : "recruiter",
  }));
  mock.method(OrganizationMember, "findOne", () => ({
    sort() {
      return this;
    },
    populate: async () => ({ role, organization: { _id: org } }),
  }));
  mock.method(AIInsight, "create", async (data) => ({
    ...data,
    _id: "insight",
    createdAt: new Date(),
  }));
}
afterEach(() => {
  mock.restoreAll();
  delete process.env.GROQ_API_KEY;
});
test("all AI actions and statistics reject anonymous requests", async () => {
  for (const path of [
    "/parse-resume",
    "/screen",
    "/match",
    "/interview-questions",
  ])
    assert.equal((await request(app).post("/api/ai" + path)).status, 401);
  assert.equal((await request(app).get("/api/stats")).status, 401);
});
test("candidate and interviewer cannot run recruiting AI", async () => {
  auth("candidate");
  assert.equal(
    (await request(app).post("/api/ai/match").set("Cookie", cookie).send({}))
      .status,
    403,
  );
  mock.restoreAll();
  auth("interviewer");
  assert.equal(
    (await request(app).post("/api/ai/screen").set("Cookie", cookie).send({}))
      .status,
    403,
  );
});
test("invalid comparisons and question counts return 400", async () => {
  auth();
  assert.equal(
    (
      await request(app)
        .post("/api/ai/screen")
        .set("Cookie", cookie)
        .send({ resumeText: "tiny", jobDescription: "tiny" })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(app)
        .post("/api/ai/interview-questions")
        .set("Cookie", cookie)
        .send({ jobDescription: "Valid description for testing", count: 11 })
    ).status,
    400,
  );
});
test("missing key returns actionable 503 without affecting health", async () => {
  auth();
  const r = await request(app)
    .post("/api/ai/screen")
    .set("Cookie", cookie)
    .send({
      resumeText: "React and Node.js project developer",
      jobDescription: "React and Node.js developer role",
    });
  assert.equal(r.status, 503);
  assert.match(r.body.message, /GROQ_API_KEY/);
  assert.equal((await request(app).get("/health")).status, 200);
});
test("stored comparisons enforce organization ownership", async () => {
  auth();
  let filter;
  mock.method(Candidate, "findOne", async (q) => {
    filter = q;
    return null;
  });
  mock.method(Job, "findOne", async () => null);
  const r = await request(app)
    .post("/api/ai/match")
    .set("Cookie", cookie)
    .send({ candidateId: String(candidate), jobId: String(job) });
  assert.equal(r.status, 404);
  assert.equal(String(filter.organization), String(org));
});
test("statistics use database counts, published jobs and distinct selected candidates", async () => {
  auth();
  mock.method(Organization, "countDocuments", async () => 2);
  mock.method(Job, "countDocuments", async (filter) => {
    assert.ok(filter.status.$in.includes("published"));
    assert.ok(!filter.status.$in.includes("draft"));
    return 4;
  });
  mock.method(Application, "distinct", async (field, filter) => {
    assert.equal(field, "candidate");
    assert.equal(filter.status, "selected");
    return [candidate];
  });
  const r = await request(app).get("/api/stats").set("Cookie", cookie);
  assert.equal(r.status, 200);
  assert.equal(r.body.data.organizations, 2);
  assert.equal(r.body.data.jobsPosted, 4);
  assert.equal(r.body.data.candidatesHired, 1);
  assert.equal(r.headers["cache-control"], "no-store");
});
test("PDF/DOCX signature mismatch and unreadable uploads are rejected", async () => {
  await assert.rejects(
    extractResumeText({
      mimetype: "application/pdf",
      buffer: Buffer.from("forged pdf content"),
    }),
    /signature/,
  );
  auth();
  const r = await request(app)
    .post("/api/ai/parse-resume")
    .set("Cookie", cookie)
    .attach("resume", Buffer.alloc(5 * 1024 * 1024 + 1), {
      filename: "big.pdf",
      contentType: "application/pdf",
    });
  assert.equal(r.status, 413);
});
test("schemas reject invented output fields and invalid evidence status", () => {
  assert.throws(() =>
    validators.matching.parse({
      requirements: [
        { requirement: "React", status: "reject", evidence: "none" },
      ],
      matchedSkills: [],
      missingEvidence: [],
      explanation: "",
    }),
  );
});
test("Groq screening uses structured outputs and records organization-scoped evidence", async () => {
  auth();
  process.env.GROQ_API_KEY = "gsk_test_key_for_mocked_requests";
  const result = {
    summary: "Documented React project.",
    matchedQualifications: ["React"],
    missingEvidence: ["Docker"],
    concernsToVerify: [],
    strengths: ["Project experience"],
    recommendation: "review",
  };
  let payload;
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(String(url), /^https:\/\/api.groq.com\//);
    payload = JSON.parse(options.body);
    return Response.json({
      choices: [
        { finish_reason: "stop", message: { content: JSON.stringify(result) } },
      ],
    });
  });
  const r = await request(app)
    .post("/api/ai/screen")
    .set("Cookie", cookie)
    .send({
      resumeText: "React and Node.js project developer",
      jobDescription: "React and Docker developer role",
    });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, result);
  assert.equal(payload.response_format.json_schema.strict, true);
});
test("provider rate limits are returned without leaking provider response data", async () => {
  auth();
  process.env.GROQ_API_KEY = "gsk_test_key_for_mocked_requests";
  mock.method(globalThis, "fetch", async () =>
    Response.json(
      { error: { message: "sensitive-provider-internals" } },
      { status: 429 },
    ),
  );
  const r = await request(app)
    .post("/api/ai/match")
    .set("Cookie", cookie)
    .send({
      resumeText: "React and Node.js project developer",
      jobDescription: "React and Docker developer role",
    });
  assert.equal(r.status, 429);
  assert.ok(!JSON.stringify(r.body).includes("sensitive-provider-internals"));
});
test("real PDF and DOCX documents extract readable resume text", async () => {
  const { readFile } = await import("node:fs/promises");
  for (const [name, mimetype] of [
    ["resume.pdf", "application/pdf"],
    [
      "resume.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ]) {
    const text = await extractResumeText({
      buffer: await readFile(new URL("./fixtures/" + name, import.meta.url)),
      mimetype,
    });
    assert.match(text, /React and Node.js/);
  }
});
test("foreign organization header and cross-site origin are rejected", async () => {
  auth();
  assert.equal(
    (
      await request(app)
        .post("/api/ai/screen")
        .set("Cookie", cookie)
        .set("x-organization-id", String(new mongoose.Types.ObjectId()))
        .send({})
    ).status,
    403,
  );
  assert.equal(
    (
      await request(app)
        .post("/api/ai/screen")
        .set("Cookie", cookie)
        .set("Origin", "https://untrusted.example")
        .send({})
    ).status,
    403,
  );
});
test("resume parsing saves extracted facts and source text to the authorized candidate", async () => {
  auth();
  process.env.GROQ_API_KEY = "gsk_test_key_for_mocked_requests";
  const { readFile } = await import("node:fs/promises");
  let saved = false;
  const record = {
    _id: candidate,
    save: async () => {
      saved = true;
    },
  };
  mock.method(Candidate, "findOne", async (filter) => {
    assert.equal(String(filter.organization), String(org));
    return record;
  });
  const parsed = {
    name: "Test Candidate",
    email: "",
    phone: "",
    skills: ["React"],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    summary: "React developer",
  };
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      choices: [
        { finish_reason: "stop", message: { content: JSON.stringify(parsed) } },
      ],
    }),
  );
  const r = await request(app)
    .post("/api/ai/parse-resume")
    .set("Cookie", cookie)
    .field("candidateId", String(candidate))
    .attach(
      "resume",
      await readFile(new URL("./fixtures/resume.docx", import.meta.url)),
      {
        filename: "resume.docx",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    );
  assert.equal(r.status, 200);
  assert.equal(saved, true);
  assert.deepEqual(record.parsedResume, parsed);
  assert.match(record.resumeText, /React/);
});
test("JD matching returns requirement-level evidence", async () => {
  auth();
  process.env.GROQ_API_KEY = "gsk_test_key_for_mocked_requests";
  const data = {
    requirements: [
      {
        requirement: "React",
        status: "met",
        evidence: "React project documented",
      },
    ],
    matchedSkills: ["React"],
    missingEvidence: [],
    explanation: "Documented match",
  };
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      choices: [
        { finish_reason: "stop", message: { content: JSON.stringify(data) } },
      ],
    }),
  );
  const r = await request(app)
    .post("/api/ai/match")
    .set("Cookie", cookie)
    .send({
      resumeText: "React and Node.js project developer",
      jobDescription: "React and Docker developer role",
    });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, data);
});
test("interview generation returns requested question count and evaluation guidance", async () => {
  auth();
  process.env.GROQ_API_KEY = "gsk_test_key_for_mocked_requests";
  const data = {
    questions: [
      {
        question: "How do you test a React component?",
        category: "technical",
        difficulty: "medium",
        evaluationGuide: "Look for behavior-focused tests.",
      },
    ],
  };
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      choices: [
        { finish_reason: "stop", message: { content: JSON.stringify(data) } },
      ],
    }),
  );
  const r = await request(app)
    .post("/api/ai/interview-questions")
    .set("Cookie", cookie)
    .send({ jobDescription: "React and Docker developer role", count: 1 });
  assert.equal(r.status, 200);
  assert.equal(r.body.data.questions.length, 1);
});
