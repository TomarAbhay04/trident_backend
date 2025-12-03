// src/routes/dashboardRoutes.js
import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, adminOnly, getDashboardStats);

export default router;
