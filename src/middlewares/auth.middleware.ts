import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyToken } from "../utils/jwt";
import { errorResponse } from "../utils/api-response";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const decoded = verifyToken(token) as {
      userId: number;
      email?: string;
      role: Role;
    };

    // Cast req to any to add user property
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.clearCookie("token");
    errorResponse(res, "Invalid or expired token", 401);
  }
};
