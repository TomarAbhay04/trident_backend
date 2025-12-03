// src/routes/policyCategoryRoutes.js
import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/policyCategoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
