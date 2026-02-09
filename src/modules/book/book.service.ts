import * as dao from "./book.dao";
import { AppError } from "../../utils/app-error";
import { CreateBookRequest, UpdateBookRequest } from "./book.types";

export const createBook = async (data: CreateBookRequest) => {
  return dao.createBook({
    ...data,
    stock: data.stock || 0,
    coverImage: data.coverImage || null,
  });
};

export const getBooks = async () => {
  return dao.getAllBooks();
};

export const getBookById = async (id: number) => {
  const book = await dao.getBookById(id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return book;
};

export const updateBook = async (id: number, data: UpdateBookRequest) => {
  await getBookById(id);

  if (data.stock !== undefined && data.stock < 0) {
    throw new AppError("Stock cannot be negative", 400);
  }

  if (data.price !== undefined && data.price <= 0) {
    throw new AppError("Price must be greater than 0", 400);
  }

  return dao.updateBook(id, data);
};

export const deleteBook = async (id: number) => {
  await getBookById(id);

  const bookWithOrders = await dao.getBookWithOrders(id);

  if (bookWithOrders && bookWithOrders.orderItems.length > 0) {
    throw new AppError(
      "Cannot delete book that has orders. Set stock to 0 instead.",
      400,
    );
  }

  return dao.deleteBook(id);
};

export const updateBookStock = async (id: number, quantity: number) => {
  const book = await dao.getBookById(id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (book.stock < quantity) {
    throw new AppError("Not enough stock", 400);
  }

  return dao.updateBookStock(id, quantity);
};

export const searchBooks = async (query: string) => {
  return dao.searchBooks(query);
};

export const getBooksByAuthor = async (author: string) => {
  return dao.getBooksByAuthor(author);
};
