import { Request, Response, NextFunction } from "express";
import * as service from "./auth.service";
import { successResponse, errorResponse } from "../../utils/api-response";
import { cookieOptions } from "../../utils/jwt";

// Simple interface for authenticated request
interface AuthRequest extends Request {
  user?: {
    userId: number;
    email?: string;
    role: string;
  };
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await service.register(req.body);

    // Set token in HTTP-only cookie
    res.cookie("token", result.token, cookieOptions);

    successResponse(
      res,
      { user: result.user },
      "User registered successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await service.login(req.body);

    // Set token in HTTP-only cookie
    res.cookie("token", result.token, cookieOptions);

    successResponse(res, { user: result.user }, "Login successful");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Type assertion
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Not authenticated", 401);
      return;
    }

    const profile = await service.getProfile(authReq.user.userId);
    successResponse(res, profile, "Profile retrieved");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  successResponse(res, null, "Logged out successfully");
};
