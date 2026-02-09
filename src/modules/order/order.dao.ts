import { prisma } from "../../config/prisma";

export const createOrder = async (
  userId: number,
  items: {
    bookId: number;
    quantity: number;
    price: number;
  }[],
) => {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
      },
    });

    await Promise.all(
      items.map((item) =>
        tx.orderItem.create({
          data: {
            orderId: order.id,
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
          },
        }),
      ),
    );

    await Promise.all(
      items.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
  });
};

export const getOrderById = (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
        },
      },
    },
  });
};

export const getOrdersByUser = (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrders = () => {
  return prisma.order.findMany({
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: {
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateOrderStatus = async (id: number, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
        },
      },
    },
  });
};

export const cancelOrderWithStockRestoration = async (orderId: number) => {
  return prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({
      where: { orderId },
    });

    await Promise.all(
      orderItems.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );

    return tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
  });
};
