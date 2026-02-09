import request from "supertest";
import app from "../src/app";

describe("Validation Middleware", () => {
  describe("Create Book Validation", () => {
    it("should fail if title is missing", async () => {
      const res = await request(app).post("/api/books").send({
        author: "Author",
        price: 100,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail if author is missing", async () => {
      const res = await request(app).post("/api/books").send({
        title: "Book",
        price: 100,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail if price is missing", async () => {
      const res = await request(app).post("/api/books").send({
        title: "Book",
        author: "Author",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail if price is invalid", async () => {
      const res = await request(app).post("/api/books").send({
        title: "Book",
        author: "Author",
        price: -10,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Book ID Validation", () => {
    it("should fail if id is not a number", async () => {
      const res = await request(app).get("/api/books/abc");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail if id is less than 1", async () => {
      const res = await request(app).get("/api/books/0");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
