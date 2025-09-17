// routes/regulator.js
import express from "express";
import {
  verifyBatch,
  certifyBatch,
  analytics,
} from "../controllers/regulatorController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.post("/verify", protect, requireRole("regulator"), verifyBatch);
router.post("/certify", protect, requireRole("regulator"), certifyBatch);
router.get("/analytics", protect, requireRole("regulator"), analytics);

export default router;
