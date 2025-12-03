// src/routes/authRoutes.js
import { Router } from "express";
import { registerAdmin, login } from "../controllers/authController.js";

const router = Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);

export default router;
