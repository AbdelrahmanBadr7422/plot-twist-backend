import { Request, Response, NextFunction } from "express";
import * as orderService from "./order.service";
import { successResponse, errorResponse } from "../../utils/api-response";

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
 * tags:
 *   name: Orders
 *   description: Orders management
 */

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const order = await orderService.createOrder(authReq.user.userId, req.body);
    successResponse(res, order, "Order created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const orders = await orderService.getUserOrders(authReq.user.userId);
    successResponse(res, orders, "Orders fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const order = await orderService.getOrderById(
      Number(req.params.id),
      authReq.user.userId,
      authReq.user.role,
    );
    successResponse(res, order, "Order fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const order = await orderService.cancelOrder(
      Number(req.params.id),
      authReq.user.userId,
    );
    successResponse(res, order, "Order cancelled successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const orders = await orderService.getAllOrders();
    successResponse(res, orders, "All orders fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      errorResponse(res, "Authentication required", 401);
      return;
    }

    const order = await orderService.updateOrderStatus(
      Number(req.params.id),
      req.body.status,
      authReq.user.userId,
      authReq.user.role,
    );
    successResponse(res, order, "Order status updated successfully");
  } catch (error) {
    next(error);
  }
};
