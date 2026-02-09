import { body, param } from "express-validator";

export const bookIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Book ID must be a positive number"),
];

export const createBookValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1-200 characters"),

  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Author must be between 2-100 characters"),

  body("price")
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage("Price must be between 0.01 and 10000"),

  body("stock")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Stock must be between 0-10000"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description too long (max 1000 characters)")
    .trim(),

  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage("Cover image must be a valid image URL (jpg, png, gif, webp)"),
];

export const updateBookValidators = [
  body("title").optional().notEmpty().trim().isLength({ min: 1, max: 200 }),

  body("author").optional().notEmpty().trim().isLength({ min: 2, max: 100 }),

  body("price").optional().isFloat({ min: 0.01, max: 10000 }),

  body("stock").optional().isInt({ min: 0, max: 10000 }),

  body("description").optional().isLength({ max: 1000 }).trim(),

  body("coverImage")
    .optional()
    .isURL()
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i),
];
