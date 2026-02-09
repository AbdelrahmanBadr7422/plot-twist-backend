import request from "supertest";
import app from "../src/app";

describe("Auth API Tests", () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "password123",
    name: "Test User",
  };

  it("should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  }, 10000);

  it("should login user", async () => {
    const uniqueEmail = `login${Date.now()}@test.com`;
    await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "password123",
      name: "Login User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
  }, 10000);

  it("should get user profile", async () => {
    const uniqueEmail = `profile${Date.now()}@test.com`;

    const registerRes = await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "password123",
      name: "Profile User",
    });

    const cookie = registerRes.headers["set-cookie"];

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", cookie);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.data.email).toBe(uniqueEmail);
  }, 10000);

  it("should logout user", async () => {
    const uniqueEmail = `logout${Date.now()}@test.com`;

    const registerRes = await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "password123",
      name: "Logout User",
    });

    const cookie = registerRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  }, 10000);

  it("should not login with wrong password", async () => {
    const uniqueEmail = `wrongpass${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "correctpassword",
      name: "User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should not register with duplicate email", async () => {
    const uniqueEmail = `duplicate${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "password123",
      name: "First User",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "password123",
      name: "Second User",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already");
  }, 10000);

  it("should require authentication for profile", async () => {
    const res = await request(app).get("/api/auth/profile");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  }, 10000);
});
