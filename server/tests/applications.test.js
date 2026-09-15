import request from "supertest";
import app from "../src/app.js";

import User from "../src/models/User.js";
import Organization from "../src/models/Organization.js";
import OrganizationMember from "../src/models/OrganizationMember.js";
import Job from "../src/models/Job.js";
import Candidate from "../src/models/Candidate.js";

describe("Applications API", () => {
  let agent;
  let organization;
  let job;
  let candidate;

  beforeEach(async () => {
    agent = request.agent(app);

    const registerResponse = await agent
      .post("/api/auth/register")
      .send({
        firstName: "Application",
        lastName: "Tester",
        email: "applicationtester@example.com",
        password: "Password123"
      });

    const userId = registerResponse.body.user._id;

    const user = await User.findById(userId);

    organization = await Organization.create({
      name: "Application Test Organization",
      slug: `application-org-${Date.now()}`,
      owner: user._id
    });

    await OrganizationMember.create({
      organization: organization._id,
      user: user._id,
      role: "owner",
      permissions: {
        manageJobs: true,
        manageCandidates: true,
        manageApplications: true,
        manageInterviews: true,
        manageMembers: true,
        viewAnalytics: true
      }
    });

    job = await Job.create({
      organization: organization._id,
      createdBy: user._id,
      title: "MERN Developer",
      department: "Engineering",
      description: "MERN developer required.",
      requirements: [
        "JavaScript",
        "React",
        "Node.js"
      ],
      responsibilities: [
        "Develop web applications"
      ],
      skills: [
        "JavaScript",
        "React",
        "Node.js"
      ],
      location: "Remote",
      employmentType: "full-time",
      experienceLevel: "entry",
      openings: 1
    });

    candidate = await Candidate.create({
      organization: organization._id,
      createdBy: user._id,
      firstName: "Test",
      lastName: "Candidate",
      email: "testcandidate@example.com",
      skills: [
        "JavaScript",
        "React",
        "Node.js"
      ],
      source: "website"
    });
  });

  test("POST /api/applications should create application", async () => {
    const response = await agent
      .post("/api/applications")
      .set(
        "x-organization-id",
        organization._id.toString()
      )
      .send({
        job: job._id,
        candidate: candidate._id,
        source: "website",
        coverLetter:
          "I am interested in this position."
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(
      response.body.application
    ).toBeDefined();
  });

  test("GET /api/applications should return applications", async () => {
    const response = await agent
      .get("/api/applications")
      .set(
        "x-organization-id",
        organization._id.toString()
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  test("GET /api/applications/pipeline should return recruitment pipeline", async () => {
    const response = await agent
      .get("/api/applications/pipeline")
      .set(
        "x-organization-id",
        organization._id.toString()
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});