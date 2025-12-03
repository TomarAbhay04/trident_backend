// src/routes/policyRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createPolicy, getPolicies } from "../controllers/policyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `policy-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.use(protect, adminOnly);

router.post("/", upload.single("document"), createPolicy);
router.get("/", getPolicies);

export default router;
