import { Router } from "express";
import * as controller from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { registerValidators, loginValidators } from "./auth.validators";

const router = Router();

router.post("/register", registerValidators, validate, controller.register);

router.post("/login", loginValidators, validate, controller.login);

router.post("/logout", authMiddleware, controller.logout);

router.get("/profile", authMiddleware, controller.getProfile);

export default router;
