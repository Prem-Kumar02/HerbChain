// models/LabReport.js
import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // manufacturer
  ipfsHash: { type: String }, // store CID
  filename: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("LabReport", labReportSchema);
