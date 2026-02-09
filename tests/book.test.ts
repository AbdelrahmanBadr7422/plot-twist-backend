import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

describe("Book API Tests", () => {
  let adminCookie: string;
  let bookId: number;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post("/api/auth/register").send({
      email: "admin@test.com",
      password: "admin123",
      name: "Admin User",
    });

    await prisma.user.update({
      where: { email: "admin@test.com" },
      data: { role: "ADMIN" },
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });

    adminCookie = loginRes.headers["set-cookie"]?.toString() || "";
  });

  it("should get all books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Cookie", [adminCookie])
      .send({
        title: "Simple Test Book",
        author: "Test Author",
        price: 29.99,
        stock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Simple Test Book");

    bookId = res.body.data.id;
  });

  it("should get book by ID", async () => {
    const res = await request(app).get(`/api/books/${bookId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(bookId);
  });

  it("should update a book", async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Cookie", [adminCookie])
      .send({
        title: "Updated Book Title",
        price: 39.99,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Book Title");
  });

  it("should delete a book", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Cookie", [adminCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should not create book if not admin", async () => {
    await request(app).post("/api/auth/register").send({
      email: "user@test.com",
      password: "user123",
      name: "Regular User",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "user123",
    });

    const userCookie = loginRes.headers["set-cookie"]?.toString() || "";

    const res = await request(app)
      .post("/api/books")
      .set("Cookie", [userCookie])
      .send({
        title: "Unauthorized Book",
        author: "Author",
        price: 10,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 for non-existent book", async () => {
    const res = await request(app).get("/api/books/99999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
