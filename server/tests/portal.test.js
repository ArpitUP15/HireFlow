import request from "supertest";
import app from "../src/app.js";

describe("Candidate portal API", () => {
  test("GET /api/portal/applications should require authentication", async () => {
    const response = await request(app).get("/api/portal/applications");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test.each([
    ["GET", "/api/portal/profile"],
    ["PUT", "/api/portal/profile"],
    ["POST", "/api/portal/profile/resume"],
    ["GET", "/api/portal/profile/resume"],
    ["GET", "/api/portal/jobs"],
    ["POST", "/api/portal/jobs/invalid-id/apply"],
  ])("%s %s should require authentication", async (method, endpoint) => {
    const response = await request(app)[method.toLowerCase()](endpoint);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/portal/applications should reject non-candidate users", async () => {
    const agent = request.agent(app);
    const registration = await agent
      .post("/api/auth/register")
      .send({
        firstName: "Portal",
        lastName: "Recruiter",
        email: "portal-recruiter@example.com",
        password: "Password123!",
        role: "recruiter",
      });

    expect(registration.statusCode).toBe(201);

    const response = await agent.get("/api/portal/applications");

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/portal/applications should return the candidate application response", async () => {
    const agent = request.agent(app);
    const registration = await agent
      .post("/api/auth/register")
      .send({
        firstName: "Portal",
        lastName: "Candidate",
        email: "portal-candidate@example.com",
        password: "Password123!",
      });

    expect(registration.statusCode).toBe(201);

    const response = await agent
      .get("/api/portal/applications?page=1&limit=15");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.applications).toEqual([]);
    expect(response.body.counts).toEqual({
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
    });
    expect(response.body.pages).toBe(1);
  });
});
