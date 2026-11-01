import request from "supertest";
import app from "../src/app.js";

describe("Authentication API", () => {
  const user = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    password: "Password123!"
  };

  test("POST /api/auth/register should create a user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.user).toBeDefined();

    expect(response.body.user.email).toBe(
      user.email
    );

    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test.each([
    ["too short", "Pass1!"],
    ["missing uppercase letter", "password123!"],
    ["missing lowercase letter", "PASSWORD123!"],
    ["missing number", "Password!!!!"],
    ["missing special character", "Password1234"]
  ])(
    "POST /api/auth/register should reject passwords %s",
    async (_reason, password) => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...user, password });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/password/i);
    }
  );

  test("POST /api/auth/login should login user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.user.email).toBe(
      user.email
    );

    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("POST /api/auth/login should reject wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "WrongPassword123"
      });

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test("GET /api/auth/me should reject unauthenticated user", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test("POST /api/auth/logout should logout user", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send(user);

    const response = await agent
      .post("/api/auth/logout");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});