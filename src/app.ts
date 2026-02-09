import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "./config/swagger";

// Add type declaration here
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

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Setup Swagger (only in development)
if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}

// Routes
app.use("/api", routes);

// Error handling
app.use(errorMiddleware);

export default app;
