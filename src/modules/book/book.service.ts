import * as dao from "./book.dao";
import { AppError } from "../../utils/app-error";
import { CreateBookRequest, UpdateBookRequest } from "./book.types";

export const createBook = async (data: CreateBookRequest) => {
  return dao.createBook(data);
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
  return dao.updateBook(id, data);
};

export const deleteBook = async (id: number) => {
  await getBookById(id);
  return dao.deleteBook(id);
};
