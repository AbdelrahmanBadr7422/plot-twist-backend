import { body } from "express-validator";

export const registerValidators = [
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
];

export const loginValidators = [
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];
