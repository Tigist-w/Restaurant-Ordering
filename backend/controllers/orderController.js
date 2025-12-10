// backend/controllers/orderController.js
import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";

// Create order
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod,
  });

  res.status(201).json(order);
});

// Get orders for user
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.menuItem"
  );
  res.json(orders);
});

// Get all orders (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user").populate("items.menuItem");
  res.json(orders);
});

// Update order status (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = req.body.status || order.status;
  await order.save();
  res.json(order);
});

// Delete order (Admin)
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await order.deleteOne();
  res.json({ message: "Order deleted successfully" });
});
