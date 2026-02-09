import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

describe("Auth API Tests", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "newuser@test.com",
      password: "password123",
      name: "New User",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login user", async () => {
    await request(app).post("/api/auth/register").send({
      email: "loginuser@test.com",
      password: "password123",
      name: "Login User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "loginuser@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should get user profile", async () => {
    await request(app).post("/api/auth/register").send({
      email: "profile@test.com",
      password: "password123",
      name: "Profile User",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "profile@test.com",
      password: "password123",
    });

    const cookie = loginRes.headers["set-cookie"]?.toString() || "";

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", [cookie]);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.data.email).toBe("profile@test.com");
  });

  it("should logout user", async () => {
    await request(app).post("/api/auth/register").send({
      email: "logout@test.com",
      password: "password123",
      name: "Logout User",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "logout@test.com",
      password: "password123",
    });

    const cookie = loginRes.headers["set-cookie"]?.toString() || "";

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", [cookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "wrongpass@test.com",
      password: "password123",
      name: "User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@test.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should not register with duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "duplicate@test.com",
      password: "password123",
      name: "First User",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "duplicate@test.com",
      password: "password123",
      name: "Second User",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
