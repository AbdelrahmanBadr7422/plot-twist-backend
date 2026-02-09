import { Request, Response, NextFunction } from "express";
import * as service from "./book.service";
import { successResponse } from "../../utils/api-response";

// Add type declaration for req.user (even if not used here, for consistency)
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
