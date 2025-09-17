// routes/farmer.js
import express from "express";
import {
  addBatch,
  getMyBatches,
  getBatch,
} from "../controllers/farmerController.js";
import { protect, requireRole } from "../middleware/auth.js";
const router = express.Router();

router.post("/add-batch", protect, requireRole("farmer"), addBatch);
router.get("/history", protect, requireRole("farmer"), getMyBatches);
router.get("/batch/:id", protect, getBatch);

export default router;
