import { prisma } from "../src/config/prisma";

export const createBook = async () => {
  return prisma.book.create({
    data: {
      title: "Test Book",
      author: "Test Author",
      price: 100,
      stock: 5,
      isbn: `978-${Date.now()}`,
    },
  });
};
