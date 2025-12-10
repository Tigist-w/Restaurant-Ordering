import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Save user cart
export const saveCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = req.body.cartItems;
  await user.save();
  res.status(200).json({ message: "Cart saved" });
});

// Get user cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.menuItem");
  res.status(200).json(user.cart || []);
});
