import request from "supertest";
import app from "../src/app.js";

import User from "../src/models/User.js";
import Organization from "../src/models/Organization.js";
import OrganizationMember from "../src/models/OrganizationMember.js";

describe("Candidates API", () => {
  let agent;
  let organization;

  beforeEach(async () => {
    agent = request.agent(app);

    const registerResponse = await agent
      .post("/api/auth/register")
      .send({
        firstName: "Candidate",
        lastName: "Tester",
        email: "candidatetester@example.com",
        password: "Password123"
      });

    const userId = registerResponse.body.user._id;

    const user = await User.findById(userId);

    organization = await Organization.create({
      name: "Candidate Test Organization",
      slug: `candidate-org-${Date.now()}`,
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

//   test("GET /api/candidates should return candidates", async () => {
//     const response = await agent
//       .get("/api/candidates")
//       .set(
//         "x-organization-id",
//         organization._id.toString()
//       );

//     expect(response.statusCode).toBe(200);

//     expect(response.body.success).toBe(true);

//     expect(
//       Array.isArray(response.body.candidates)
//     ).toBe(true);
//   });

  test("POST /api/candidates should create candidate", async () => {
  const response = await agent
    .post("/api/candidates")
    .set(
      "x-organization-id",
      organization._id.toString()
    )
    .send({
      firstName: "Arpit",
      lastName: "Candidate",
      email: "arpitcandidate@example.com",
      phone: "9876543210",
      location: "India",
      headline: "MERN Stack Developer",
      summary:
        "Computer Science student and MERN developer.",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB"
      ],
      source: "website"
    });

  expect(response.statusCode).toBe(201);

  expect(response.body.candidate).toBeDefined();

  expect(
    response.body.candidate.email
  ).toBe(
    "arpitcandidate@example.com"
  );
  });
});