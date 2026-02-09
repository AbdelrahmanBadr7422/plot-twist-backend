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
      throw new AppError(`Book ${item.bookId} not found`, 404);
    }

    if (book.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${book.title}`, 400);
    }

    items.push({
      bookId: book.id,
      quantity: item.quantity,
      price: book.price,
    });
  }

  try {
    return await orderDao.createOrder(userId, items);
  } catch {
    throw new AppError("Order failed no items avaliable", 400);
  }
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
    throw new AppError("Not authorized", 403);
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
    throw new AppError("Not authorized", 403);
  }

  if (order.status !== "PENDING") {
    throw new AppError("Cannot cancel now", 400);
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
    throw new AppError("Admin only", 403);
  }

  const valid = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!valid.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  return orderDao.updateOrderStatus(orderId, status);
};
