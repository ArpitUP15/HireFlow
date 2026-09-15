import request from "supertest";
import app from "../src/app.js";

import User from "../src/models/User.js";
import Organization from "../src/models/Organization.js";
import OrganizationMember from "../src/models/OrganizationMember.js";

describe("Jobs API", () => {
  let agent;
  let organization;

  beforeEach(async () => {
    agent = request.agent(app);

    const registerResponse = await agent
      .post("/api/auth/register")
      .send({
        firstName: "Job",
        lastName: "Tester",
        email: "jobtester@example.com",
        password: "Password123"
      });

    const userId = registerResponse.body.user._id;

    const user = await User.findById(userId);

    organization = await Organization.create({
      name: "Test Organization",
      slug: `test-org-${Date.now()}`,
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
  });

  test("GET /api/jobs should return jobs", async () => {
    const response = await agent
      .get("/api/jobs")
      .set(
        "x-organization-id",
        organization._id.toString()
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.jobs)).toBe(
      true
    );
  });

  test("POST /api/jobs should create a job", async () => {
  const response = await agent
    .post("/api/jobs")
    .set(
      "x-organization-id",
      organization._id.toString()
    )
    .send({
      title: "Frontend Developer",
      department: "Engineering",
      description:
        "React developer required for HireFlow.",
      requirements: [
        "React",
        "JavaScript",
        "HTML",
        "CSS"
      ],
      responsibilities: [
        "Build frontend features"
      ],
      skills: [
        "React",
        "JavaScript"
      ],
      location: "Remote",
      employmentType: "full-time",
      experienceLevel: "entry",
      openings: 2
    });

  expect(response.statusCode).toBe(201);

  expect(response.body.job).toBeDefined();

  expect(response.body.job.title).toBe(
    "Frontend Developer"
  );
});
});