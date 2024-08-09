import express from "express";
import authMiddleware from "../middleware/auth.js"; // Import đúng với default export

import {
  placeOrder,
  userOrders,
  listOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder); // Đảm bảo xác thực người dùng
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateOrderStatus);

export default orderRouter;
