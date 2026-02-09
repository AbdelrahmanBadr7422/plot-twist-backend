import { Router } from "express";
import * as controller from "./book.controller";
import { validate } from "../../middlewares/validation.middleware";
import {
  bookIdValidator,
  createBookValidators,
  updateBookValidators,
} from "./book.validators";

const router = Router();

router.get("/", controller.getBooks);

router.get("/:id", bookIdValidator, validate, controller.getBook);

router.post("/", createBookValidators, validate, controller.createBook);

router.put(
  "/:id",
  bookIdValidator,
  updateBookValidators,
  validate,
  controller.updateBook,
);

router.delete("/:id", bookIdValidator, validate, controller.deleteBook);

export default router;
