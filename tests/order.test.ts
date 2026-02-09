import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

// Increase timeout for slow operations
jest.setTimeout(30000); // 30 seconds

describe("Order API Tests", () => {
  let userCookie: string;
  let adminCookie: string;
  let bookId: number;
  let orderId: number;

  // Setup before all tests
  beforeAll(async () => {
    // Increase timeout for this specific hook
    try {
      // Clear database in correct order to avoid foreign key constraints
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.book.deleteMany();
      await prisma.user.deleteMany();

      // Create admin user
      await request(app).post("/api/auth/register").send({
        email: "admin@order.test.com",
        password: "admin123",
        name: "Admin User",
      });

      // Set admin role directly in database
      await prisma.user.update({
        where: { email: "admin@order.test.com" },
        data: { role: "ADMIN" },
      });

      // Create regular user
      await request(app).post("/api/auth/register").send({
        email: "user@order.test.com",
        password: "user123",
        name: "Regular User",
      });

      // Login as user
      const userLogin = await request(app).post("/api/auth/login").send({
        email: "user@order.test.com",
        password: "user123",
      });

      userCookie = userLogin.headers["set-cookie"]
        ? userLogin.headers["set-cookie"][0]
        : "";

      // Login as admin
      const adminLogin = await request(app).post("/api/auth/login").send({
        email: "admin@order.test.com",
        password: "admin123",
      });

      adminCookie = adminLogin.headers["set-cookie"]
        ? adminLogin.headers["set-cookie"][0]
        : "";

      // Create a test book using admin (simpler way)
      const book = await prisma.book.create({
        data: {
          title: "Order Test Book",
          author: "Order Author",
          price: 25.99,
          stock: 20,
        },
      });

      bookId = book.id;
    } catch (error) {
      console.error("Setup error:", error);
      throw error;
    }
  }, 30000); // 30 seconds timeout for beforeAll

  // Clean up after each test
  afterEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
  });

  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Test 1: Create an order
  it("should create an order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 2,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    // Save order ID for other tests
    orderId = res.body.data.id;
  }, 10000); // 10 seconds timeout for this test

  // Test 2: Get user's orders
  it("should get user's orders", async () => {
    // First create an order
    await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
        ],
      });

    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 10000);

  // Test 3: Get order by ID
  it("should get order by ID", async () => {
    // Create an order first
    const createRes = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
        ],
      });

    const newOrderId = createRes.body.data.id;

    const res = await request(app)
      .get(`/api/orders/${newOrderId}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(newOrderId);
  }, 10000);

  // Test 4: Cancel an order
  it("should cancel an order", async () => {
    // Create an order first
    const createRes = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
        ],
      });

    const newOrderId = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/orders/${newOrderId}/cancel`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("CANCELLED");
  }, 10000);

  // Test 5: Admin can get all orders
  it("should get all orders (admin only)", async () => {
    // Create an order first
    await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
        ],
      });

    const res = await request(app)
      .get("/api/orders")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  // Test 6: Regular user cannot get all orders
  it("should not get all orders if not admin", async () => {
    const res = await request(app).get("/api/orders").set("Cookie", userCookie);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  }, 10000);

  // Test 7: Create order with multiple books
  it("should create order with multiple books", async () => {
    // Create another book
    const book2 = await prisma.book.create({
      data: {
        title: "Second Book",
        author: "Second Author",
        price: 15.99,
        stock: 10,
      },
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
          {
            bookId: book2.id,
            quantity: 2,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(2);
  }, 10000);

  // Test 8: Should not create order without items
  it("should not create order without items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 10000);

  // Test 9: Should not create order with invalid book
  it("should not create order with invalid book", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", userCookie)
      .send({
        items: [
          {
            bookId: 99999, // Non-existent book
            quantity: 1,
          },
        ],
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  }, 10000);

  // Test 10: Should not create order without login
  it("should not create order without login", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        items: [
          {
            bookId: bookId,
            quantity: 1,
          },
        ],
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  }, 10000);
});
