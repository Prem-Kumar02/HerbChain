// routes/distributor.js
import express from "express";
import multer from "multer";
import {
  packageBatch,
  logTransport,
  markDelivered,
} from "../controllers/distributorController.js";
import { protect, requireRole } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/package",
  protect,
  requireRole("exporter"),
  upload.single("file"),
  packageBatch
);
router.post("/transport", protect, requireRole("exporter"), logTransport);
router.post("/deliver", protect, requireRole("exporter"), markDelivered);

export default router;
