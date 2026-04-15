import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import "./setup";

describe("Users API", () => {
  let userToken: string;

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@haulr.com",
      phone: "1234567890",
      password: "password123",
      role: "vendor",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User created");
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token; // save for subsequent tests
  });

  it("should not allow registration with existing email", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Another User",
      email: "test@haulr.com",
      phone: "0987654321",
      password: "password123",
      role: "vendor",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should block invalid inputs via Zod validation", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "T", // too short
      email: "not-an-email", // invalid
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should login correctly and hit /me", async () => {
    const loginRes = await request(app).post("/api/users/login").send({
      email: "test@haulr.com",
      password: "password123",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");

    const meRes = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe("test@haulr.com");
    expect(meRes.body.role).toBe("vendor");
  });
});
