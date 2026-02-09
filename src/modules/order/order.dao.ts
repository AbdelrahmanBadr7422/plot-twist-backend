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

    for (const item of items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    for (const item of items) {
      const result = await tx.book.updateMany({
        where: {
          id: item.bookId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (result.count === 0) {
        throw new Error("Not enough stock");
      }
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
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
            select: {
              id: true,
              title: true,
              author: true,
            },
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
            select: {
              id: true,
              title: true,
              author: true,
            },
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
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
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
            select: {
              id: true,
              title: true,
              author: true,
            },
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

    for (const item of orderItems) {
      await tx.book.update({
        where: { id: item.bookId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  });
};
