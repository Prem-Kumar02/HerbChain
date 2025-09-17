// models/Batch.js
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    herbType: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    photoUrl: { type: String }, // optional base64 or hosted URL
    gps: { lat: Number, lng: Number },
    collectedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "created",
        "received",
        "tested",
        "processed",
        "packaged",
        "exported",
        "certified",
        "rejected",
      ],
      default: "created",
    },
    qrPayload: { type: String },
    blockchainTx: { type: String }, // tx id or hash when integrated
    shipmentDetails: { type: String },
    transportLogs: [
      { gps: { lat: Number, lng: Number, note: String }, time: Date },
    ],
    labReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "LabReport" }],
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
