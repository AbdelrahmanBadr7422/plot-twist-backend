import request from "supertest";
import app from "../src/app";

describe("Order API Tests", () => {
  let userCookie: string;
  let bookId: number;

  const uniqueEmail = (prefix: string) => `${prefix}${Date.now()}@test.com`;

  beforeAll(async () => {
    const userEmail = uniqueEmail("user");

    const registerRes = await request(app).post("/api/auth/register").send({
      email: userEmail,
      password: "user123",
      name: "Regular User",
    });

    userCookie = registerRes.headers["set-cookie"];
  }, 30000);

  it("should not create order without login", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        items: [
          {
            bookId: 1,
            quantity: 1,
          },
        ],
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should validate order request", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should validate order items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: 0,
            quantity: 0,
          },
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should get user's orders (empty initially)", async () => {
    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  }, 10000);

  it("should require authentication for user orders", async () => {
    const res = await request(app).get("/api/orders/my-orders");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should validate order ID parameter", async () => {
    const res = await request(app)
      .get("/api/orders/not-a-number")
      .set("Cookie", userCookie);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should handle non-existent order cancellation", async () => {
    const res = await request(app)
      .put("/api/orders/99999/cancel")
      .set("Cookie", userCookie);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should handle non-existent order", async () => {
    const res = await request(app)
      .get("/api/orders/99999")
      .set("Cookie", userCookie);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("regular user should not get all orders", async () => {
    const res = await request(app).get("/api/orders").set("Cookie", userCookie);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  }, 10000);

  it("should fail when book doesn't exist", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: 99999,
            quantity: 1,
          },
        ],
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  }, 10000);
});
