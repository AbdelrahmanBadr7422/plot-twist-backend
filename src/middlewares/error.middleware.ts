import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(" Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.code === "P2002") {
    res.status(400).json({
      success: false,
      message: "Email already exists",
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
