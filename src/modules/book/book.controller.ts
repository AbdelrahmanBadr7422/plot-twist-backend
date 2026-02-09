import { Request, Response, NextFunction } from "express";
import * as service from "./book.service";
import { successResponse } from "../../utils/api-response";

declare module "express" {
  interface Request {
    user?: {
      userId: number;
      email?: string;
      role: string;
    };
  }
}

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books management
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 */
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const books = await service.getBooks();
    successResponse(res, books, "Books retrieved successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Books found
 */
export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      successResponse(res, [], "Please provide a search query");
      return;
    }

    const books = await service.searchBooks(query);
    successResponse(res, books, "Books found");
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books/author/{author}:
 *   get:
 *     summary: Get books by author
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books by author
 */
export const getBooksByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const author: string =
      typeof req.params.author == "string"
        ? req.params.author
        : req.params.author[0];
    const books = await service.getBooksByAuthor(author);
    successResponse(res, books, `Books by ${author}`);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 */
export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await service.getBookById(id);
    successResponse(res, book, "Book retrieved successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create new book
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 description: URL to book cover image
 */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await service.createBook(req.body);
    successResponse(res, book, "Book created successfully", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await service.updateBook(id, req.body);
    successResponse(res, book, "Book updated successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await service.deleteBook(id);
    successResponse(res, null, "Book deleted successfully");
  } catch (err) {
    next(err);
  }
};
