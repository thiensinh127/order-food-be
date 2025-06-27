import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";
import { updateStatus } from "../controllers/userController.js";
const orderRouter = express.Router();

orderRouter.post("/create", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
