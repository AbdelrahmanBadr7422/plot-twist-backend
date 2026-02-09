import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validation.middleware";

import {
  createBookValidators,
  updateBookValidators,
  bookIdValidator,
} from "./book.validators";

import * as bookController from "./book.controller";

const router = Router();

// Public routes
router.get("/", bookController.getBooks);
router.get("/:id", bookIdValidator, validate, bookController.getBook);

// Admin routes
router.post(
  "/",
  createBookValidators,
  validate,
  authMiddleware,
  requireAdmin,
  bookController.createBook,
);

router.put(
  "/:id",
  updateBookValidators,
  validate,
  authMiddleware,
  requireAdmin,
  bookController.updateBook,
);

router.delete(
  "/:id",
  bookIdValidator,
  validate,
  authMiddleware,
  requireAdmin,
  bookController.deleteBook,
);

export default router;
