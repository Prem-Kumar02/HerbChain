// models/Shipment.js
import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  exporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  docs: [{ ipfsHash: String, filename: String }],
  checkpoints: [{ gps: { lat: Number, lng: Number }, time: Date }],
  status: {
    type: String,
    enum: ["packaged", "in-transit", "delivered"],
    default: "packaged",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Shipment", shipmentSchema);
