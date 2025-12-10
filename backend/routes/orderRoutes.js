// backend/routes/orderRouter.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Place a new order (user)
router.post("/", protect, createOrder);

// Get orders of logged-in user
router.get("/myorders", protect, getUserOrders);

// Get all orders (admin)
router.get("/", protect, admin, getAllOrders);

// Update order status (admin)
router.put("/:id", protect, admin, updateOrderStatus);

// Delete order (admin)
router.delete("/:id", protect, admin, deleteOrder);

export default router;
