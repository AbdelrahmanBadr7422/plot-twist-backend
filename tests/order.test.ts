import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/hash";

describe("Order API", () => {
  let userCookie: string;
  let adminCookie: string;
  let bookId: number;

  beforeAll(async () => {
    // Clear all data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    // Create regular user
    await request(app).post("/api/auth/register").send({
      email: "orderuser@test.com",
      password: "password123",
      name: "Order User",
    });

    const userLogin = await request(app).post("/api/auth/login").send({
      email: "orderuser@test.com",
      password: "password123",
    });

    userCookie = userLogin.headers["set-cookie"][0];

    // Create admin user manually
    const adminPassword = await hashPassword("admin123");
    await prisma.user.create({
      data: {
        email: "orderadmin@test.com",
        password: adminPassword,
        name: "Admin User",
        role: "ADMIN",
      },
    });

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "orderadmin@test.com",
      password: "admin123",
    });

    adminCookie = adminLogin.headers["set-cookie"][0];

    // Create test book
    const book = await prisma.book.create({
      data: {
        title: "Test Book for Orders",
        author: "Test Author",
        price: 50,
        stock: 10,
        description: "A test book for order testing",
      },
    });

    bookId = book.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/orders - Create Order", () => {
    it("should create order successfully", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 2 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.totalAmount).toBe(100); // 2 * 50
      expect(res.body.data.status).toBe("PENDING");
    });

    it("should fail with insufficient stock", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 100 }], // More than available stock
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Not enough stock");
    });

    it("should fail with non-existent book", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId: 9999, quantity: 1 }],
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Book not found");
    });

    it("should fail with invalid bookId", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId: "invalid", quantity: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail with invalid quantity", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 0 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail without authentication", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({
          items: [{ bookId, quantity: 1 }],
        });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/orders/my-orders - Get User Orders", () => {
    it("should get user's orders", async () => {
      const res = await request(app)
        .get("/api/orders/my-orders")
        .set("Cookie", userCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should fail without authentication", async () => {
      const res = await request(app).get("/api/orders/my-orders");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/orders/:id - Get Order by ID", () => {
    let orderId: number;

    beforeEach(async () => {
      const orderRes = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 1 }],
        });

      orderId = orderRes.body.data.id;
    });

    it("should get order by ID", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", userCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(orderId);
    });

    it("should fail with invalid order ID", async () => {
      const res = await request(app)
        .get("/api/orders/invalid")
        .set("Cookie", userCookie);

      expect(res.status).toBe(400);
    });

    it("should fail when accessing other user's order", async () => {
      const otherUser = await request(app).post("/api/auth/register").send({
        email: "otheruser@test.com",
        password: "password123",
        name: "Other User",
      });

      const otherCookie = otherUser.headers["set-cookie"][0];

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", otherCookie);

      expect(res.status).toBe(403);
    });

    it("admin should access any order", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(orderId);
    });

    it("should fail with non-existent order", async () => {
      const res = await request(app)
        .get("/api/orders/9999")
        .set("Cookie", userCookie);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/orders/:id/cancel - Cancel Order", () => {
    let orderId: number;

    beforeEach(async () => {
      const orderRes = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 1 }],
        });

      orderId = orderRes.body.data.id;
    });

    it("should cancel order successfully", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set("Cookie", userCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("CANCELLED");
    });

    it("should restore stock after cancellation", async () => {
      const bookBefore = await prisma.book.findUnique({
        where: { id: bookId },
      });
      const initialStock = bookBefore!.stock;

      await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set("Cookie", userCookie);

      const bookAfter = await prisma.book.findUnique({ where: { id: bookId } });
      expect(bookAfter!.stock).toBe(initialStock + 1); // Stock restored
    });

    it("should fail when cancelling non-pending order", async () => {
      // First cancel the order
      await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set("Cookie", userCookie);

      // Try to cancel again
      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set("Cookie", userCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("cannot be cancelled");
    });

    it("should fail when cancelling other user's order", async () => {
      // Create another user
      const otherRes = await request(app).post("/api/auth/register").send({
        email: "another@test.com",
        password: "password123",
        name: "Another User",
      });

      const otherCookie = otherRes.headers["set-cookie"][0];

      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set("Cookie", otherCookie);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/orders - Get All Orders (Admin)", () => {
    it("admin should get all orders", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("regular user should not get all orders", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Cookie", userCookie);

      expect(res.status).toBe(403);
    });

    it("should fail without authentication", async () => {
      const res = await request(app).get("/api/orders");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/orders/:id/status - Update Order Status (Admin)", () => {
    let orderId: number;

    beforeEach(async () => {
      const orderRes = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          items: [{ bookId, quantity: 1 }],
        });

      orderId = orderRes.body.data.id;
    });

    it("admin should update order status", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Cookie", adminCookie)
        .send({ status: "PROCESSING" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("PROCESSING");
    });

    it("should fail with invalid status", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Cookie", adminCookie)
        .send({ status: "INVALID_STATUS" });

      expect(res.status).toBe(400);
    });

    it("regular user should not update order status", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Cookie", userCookie)
        .send({ status: "PROCESSING" });

      expect(res.status).toBe(403);
    });

    it("should fail with non-existent order", async () => {
      const res = await request(app)
        .put("/api/orders/9999/status")
        .set("Cookie", adminCookie)
        .send({ status: "PROCESSING" });

      expect(res.status).toBe(404);
    });
  });
});
