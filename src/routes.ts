import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import bookRoutes from "./modules/book/book.routes";
import orderRoutes from "./modules/order/order.routes";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T12:00:00Z
 *                 service:
 *                   type: string
 *                   example: Plot Twist Book Store API
 */
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Plot Twist Book Store API",
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/orders", orderRoutes);

export default router;
