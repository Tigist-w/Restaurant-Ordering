import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import asyncHandler from "express-async-handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.menuItem.name,
        description: item.menuItem.description || undefined,
        images: item.menuItem.image ? [item.menuItem.image] : undefined,
      },
      unit_amount: Math.round(item.menuItem.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation error:", err);
    res.status(500);
    throw new Error("Failed to create Stripe session");
  }
});
