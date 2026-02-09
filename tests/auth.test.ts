import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

describe("Auth API Tests", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  // ================= REGISTER =================

  it("should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("test@test.com");

    // Cookie exists
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should not register with existing email", async () => {
    // First register
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });

    // Second register (same email)
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Email");
  });

  // ================= LOGIN =================

  it("should login with correct credentials", async () => {
    // Register first
    await request(app).post("/api/auth/register").send({
      email: "login@test.com",
      password: "password123",
      name: "Login User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Cookie exists
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "wrong@test.com",
      password: "password123",
      name: "Wrong User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@test.com",
      password: "123456",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // ================= PROFILE =================

  it("should get profile with valid cookie", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      email: "profile@test.com",
      password: "password123",
      name: "Profile User",
    });

    const cookie = registerRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("profile@test.com");
  });

  it("should not get profile without cookie", async () => {
    const res = await request(app).get("/api/auth/profile");

    expect(res.status).toBe(401);
  });

  // ================= LOGOUT =================

  it("should logout and clear cookie", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      email: "logout@test.com",
      password: "password123",
      name: "Logout User",
    });

    const cookie = registerRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
