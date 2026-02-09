import { prisma } from "../../config/prisma";
import * as orderDao from "./order.dao";
import { AppError } from "../../utils/app-error";
import { CreateOrderRequest } from "./order.types";

export const createOrder = async (userId: number, data: CreateOrderRequest) => {
  const items = [];

  for (const item of data.items) {
    const book = await prisma.book.findUnique({
      where: { id: item.bookId },
    });

    if (!book) {
      throw new AppError(`Book with ID ${item.bookId} not found`, 404);
    }

    if (book.stock < item.quantity) {
      throw new AppError(
        `Not enough stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`,
        400,
      );
    }

    items.push({
      bookId: book.id,
      quantity: item.quantity,
      price: book.price,
    });
  }

  return orderDao.createOrder(userId, items);
};

export const getOrderById = async (
  orderId: number,
  userId: number,
  role: string,
) => {
  const order = await orderDao.getOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (role !== "ADMIN" && order.userId !== userId) {
    throw new AppError("You are not authorized to view this order", 403);
  }

  return order;
};

export const getUserOrders = async (userId: number) => {
  return orderDao.getOrdersByUser(userId);
};

export const getAllOrders = async () => {
  return orderDao.getAllOrders();
};

export const cancelOrder = async (orderId: number, userId: number) => {
  const order = await orderDao.getOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.userId !== userId) {
    throw new AppError("You are not authorized to cancel this order", 403);
  }

  if (order.status !== "PENDING") {
    throw new AppError(
      `Order cannot be cancelled. Current status: ${order.status}`,
      400,
    );
  }

  return orderDao.cancelOrderWithStockRestoration(orderId);
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
  userId: number,
  role: string,
) => {
  if (role !== "ADMIN") {
    throw new AppError("Admin access required", 403);
  }

  const order = await orderDao.getOrderById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const validStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new AppError(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      400,
    );
  }

  return orderDao.updateOrderStatus(orderId, status);
};
