// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.js";
import farmerRoutes from "./src/routes/farmer.js";
import manufacturerRoutes from "./src/routes/manufacturer.js";
import distributorRoutes from "./src/routes/distributor.js"; // remove if no distributor
import regulatorRoutes from "./src/routes/regulator.js";
import consumerRoutes from "./src/routes/consumer.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// MongoDB Connection
connectDB(); // uses config/db.js

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/manufacturer", manufacturerRoutes);
app.use("/api/regulator", regulatorRoutes);
app.use("/api/consumer", consumerRoutes);

// Health check
app.get("/", (req, res) =>
  res.send({ ok: true, msg: "HerbChain API running" })
);

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
