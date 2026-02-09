import { body, param } from "express-validator";

export const bookIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Book ID must be a positive number"),
];

export const createBookValidators = [
  body("title").notEmpty().withMessage("Title is required"),

  body("author").notEmpty().withMessage("Author is required"),

  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),
];

export const updateBookValidators = [
  body("title").optional().notEmpty(),

  body("author").optional().notEmpty(),

  body("price").optional().isFloat({ min: 0.01 }),

  body("stock").optional().isInt({ min: 0 }),
];
