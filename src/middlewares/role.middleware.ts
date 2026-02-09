import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/api-response";

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email?: string;
    role: string;
  };
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authReq = req as AuthRequest;

  if (!authReq.user || authReq.user.role !== "ADMIN") {
    errorResponse(res, "Admin access required", 403);
    return;
  }
  next();
};
