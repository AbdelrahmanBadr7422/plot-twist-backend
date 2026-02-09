import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  createOrderValidators,
  orderIdValidator,
  updateOrderStatusValidators,
} from "./order.validators";
import * as orderController from "./order.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrderValidators, validate, orderController.createOrder);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:id", orderIdValidator, validate, orderController.getOrderById);
router.put(
  "/:id/cancel",
  orderIdValidator,
  validate,
  orderController.cancelOrder,
);

router.get("/", requireAdmin, orderController.getAllOrders);
router.put(
  "/:id/status",
  requireAdmin,
  orderIdValidator,
  updateOrderStatusValidators,
  validate,
  orderController.updateOrderStatus,
);

export default router;
