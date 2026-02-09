import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import bookRoutes from "./modules/book/book.routes";
import orderRoutes from "./modules/order/order.routes";

import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "./config/swagger";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email?: string;
        role: string;
      };
    }
  }
}

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  setupSwagger(app);
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Plot Twist Book Store API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorMiddleware);

export default app;
