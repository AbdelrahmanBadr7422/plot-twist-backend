import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

describe("Book API", () => {
  let bookId: number;

  beforeEach(async () => {
    await prisma.book.deleteMany();
  });

  it("should create a book", async () => {
    const res = await request(app).post("/api/books").send({
      title: "Test Book",
      author: "Test Author",
      price: 100,
      stock: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Test Book");

    bookId = res.body.data.id;
  });

  it("should get all books", async () => {
    await request(app).post("/api/books").send({
      title: "Book 1",
      author: "Author 1",
      price: 50,
    });

    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("should get book by id", async () => {
    const createRes = await request(app).post("/api/books").send({
      title: "Single Book",
      author: "Single Author",
      price: 80,
    });

    const id = createRes.body.data.id;

    const res = await request(app).get(`/api/books/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(id);
  });

  it("should update book", async () => {
    const createRes = await request(app).post("/api/books").send({
      title: "Old Title",
      author: "Author",
      price: 60,
    });

    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/books/${id}`)
      .send({ title: "New Title" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("New Title");
  });

  it("should delete book", async () => {
    const createRes = await request(app).post("/api/books").send({
      title: "Delete Me",
      author: "Author",
      price: 40,
    });

    const id = createRes.body.data.id;

    const res = await request(app).delete(`/api/books/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await prisma.book.findUnique({ where: { id } });
    expect(check).toBeNull();
  });

  it("should return 404 when book not found", async () => {
    const res = await request(app).get("/api/books/9999");

    expect(res.status).toBe(404);
  });
});
