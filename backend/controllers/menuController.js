import Menu from "../models/Menu.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinaryConfig.js";

// Get all menu items
export const getMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.find();
  res.json(menu);
});

// Create menu item (Admin only) with optional image upload
export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "restaurant-menu" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer); // send file buffer directly
      });

      imageUrl = result.secure_url;
    }

    const menuItem = await Menu.create({
      name,
      description,
      price,
      image: imageUrl,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500);
    throw new Error("Image upload failed");
  }
});

// Update menu item (Admin only)
export const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  const { name, description, price } = req.body;
  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price || menuItem.price;

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "restaurant-menu" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    menuItem.image = result.secure_url;
  }

  await menuItem.save();
  res.json(menuItem);
});

// Delete menu item (Admin only)
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  await menuItem.deleteOne(); // <-- FIXED (remove() is deprecated)

  res.json({ message: "Menu item removed" });
});
