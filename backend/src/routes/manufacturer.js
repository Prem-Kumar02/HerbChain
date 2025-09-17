// routes/manufacturer.js
import express from "express";
import {
  receiveBatch,
  uploadLabReport,
  updateProcessing,
} from "../controllers/manufacturerController.js";
import { protect, requireRole } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/receive", protect, requireRole("manufacturer"), receiveBatch);
router.post(
  "/upload-lab",
  protect,
  requireRole("manufacturer"),
  upload.single("file"),
  uploadLabReport
);
router.post("/process", protect, requireRole("manufacturer"), updateProcessing);

export default router;
