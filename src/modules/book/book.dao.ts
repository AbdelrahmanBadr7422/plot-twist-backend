import { prisma } from "../../config/prisma";
import {
  CreateBookRequest,
  UpdateBookRequest,
  BookResponse,
} from "./book.types";

export const createBook = async (
  data: CreateBookRequest,
): Promise<BookResponse> => {
  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      price: data.price,
      stock: data.stock || 0,
      description: data.description || null,
      coverImage: data.coverImage || null,
    },
  });

  return book;
};

export const getAllBooks = async (): Promise<BookResponse[]> => {
  return prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getBookById = async (id: number): Promise<BookResponse | null> => {
  return prisma.book.findUnique({
    where: { id },
  });
};

export const updateBook = async (
  id: number,
  data: UpdateBookRequest,
): Promise<BookResponse> => {
  const book = await prisma.book.update({
    where: { id },
    data,
  });

  return book;
};

export const deleteBook = async (id: number): Promise<void> => {
  await prisma.book.delete({
    where: { id },
  });
};

export const updateBookStock = async (
  id: number,
  quantity: number,
): Promise<BookResponse> => {
  const book = await prisma.book.update({
    where: { id },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });

  return book;
};

export const getBookWithOrders = async (id: number) => {
  return prisma.book.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });
};

export const searchBooks = async (query: string): Promise<BookResponse[]> => {
  return prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBooksByAuthor = async (
  author: string,
): Promise<BookResponse[]> => {
  return prisma.book.findMany({
    where: {
      author: { contains: author, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getLowStockBooks = async (
  threshold: number = 5,
): Promise<BookResponse[]> => {
  return prisma.book.findMany({
    where: {
      stock: { lte: threshold },
    },
    orderBy: { stock: "asc" },
  });
};
