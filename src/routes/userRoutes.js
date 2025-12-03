// src/routes/userRoutes.js
import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, adminOnly, createUser);
router.get("/", protect, adminOnly, getUsers);

export default router;
