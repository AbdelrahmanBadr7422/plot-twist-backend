import { body, param } from "express-validator";

export const createOrderValidators = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),

  body("items.*.bookId")
    .isInt({ gt: 0 })
    .withMessage("Invalid bookId - must be a positive integer"),

  body("items.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than zero"),
];

export const orderIdValidator = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Order ID must be a positive integer"),
];

export const updateOrderStatusValidators = [
  body("status")
    .isString()
    .isIn(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage(
      "Status must be one of: PROCESSING, SHIPPED, DELIVERED, CANCELLED",
    ),
];
