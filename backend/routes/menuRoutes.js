import express from "express";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getMenu);
router.post("/", protect, admin, upload.single("image"), createMenuItem); // only this one
router.put("/:id", protect, admin, updateMenuItem);
router.delete("/:id", protect, admin, deleteMenuItem);

export default router;
