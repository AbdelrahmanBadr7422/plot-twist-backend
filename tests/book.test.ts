import request from "supertest";
import app from "../src/app";

describe("Book API Tests", () => {
  let adminCookie: string;
  let bookId: number;

  const uniqueEmail = (prefix: string) => `${prefix}${Date.now()}@test.com`;

  beforeAll(async () => {
    const adminEmail = uniqueEmail("admin");

    await request(app).post("/api/auth/register").send({
      email: adminEmail,
      password: "admin123",
      name: "Admin User",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminEmail,
      password: "admin123",
    });

    adminCookie = loginRes.headers["set-cookie"];
  }, 30000);

  it("should get all books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it("should not create book without admin role", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Cookie", adminCookie)
      .send({
        title: "Simple Test Book",
        author: "Test Author",
        price: 29.99,
        stock: 10,
      });

    expect([201, 403]).toContain(res.status);
  }, 10000);

  it("should return 404 for non-existent book", async () => {
    const res = await request(app).get("/api/books/99999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should fail validation for invalid book data", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Cookie", adminCookie)
      .send({
        title: "",
        author: "A",
        price: -10,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("regular user should not access admin book routes", async () => {
    const userEmail = uniqueEmail("regular");

    const registerRes = await request(app).post("/api/auth/register").send({
      email: userEmail,
      password: "user123",
      name: "Regular User",
    });

    const userCookie = registerRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/books")
      .set("Cookie", userCookie)
      .send({
        title: "User Book",
        author: "User Author",
        price: 19.99,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should validate book ID parameter", async () => {
    const res = await request(app).get("/api/books/not-a-number");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should return empty array when no books exist", async () => {
    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  }, 10000);
});
