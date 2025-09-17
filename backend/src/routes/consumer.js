// routes/consumer.js
import express from "express";
import { scanBatch } from "../controllers/consumerController.js";

const router = express.Router();
router.get("/scan/:batchId", scanBatch);

export default router;
