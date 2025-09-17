// controllers/manufacturerController.js
import Batch from "../models/Batch.js";
import LabReport from "../models/LabReport.js";
import { mockUploadToIpfs } from "../utils/ipfs.js";

/**
 * Receive batch (manufacturer)
 * Body: batchId (batch._id or batchId)
 */
export const receiveBatch = async (req, res) => {
  try {
    const { batchId } = req.body;
    const batch =
      (await Batch.findOne({ batchId })) || (await Batch.findById(batchId));
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.status = "received";
    await batch.save();
    // TODO: write status tx to blockchain
    res.json({ success: true, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error receiving batch" });
  }
};

/**
 * Upload lab report (PDF) - expects multer file in req.file
 * For demo we accept ipfsHash string or file upload; if file -> mock upload returns CID
 */
export const uploadLabReport = async (req, res) => {
  try {
    const { batchId } = req.body;
    let ipfsResult = null;
    if (req.file) {
      // req.file.buffer available if multer configured to memoryStorage (but here we use disk storage for simplicity)
      ipfsResult = await mockUploadToIpfs(
        req.file.buffer || Buffer.from(req.file.path || ""),
        req.file.originalname || req.file.filename
      );
    } else if (req.body.ipfsHash) {
      ipfsResult = {
        cid: req.body.ipfsHash,
        url: `https://ipfs.io/ipfs/${req.body.ipfsHash}`,
      };
    } else {
      return res.status(400).json({ message: "No file or ipfsHash provided" });
    }

    const batch =
      (await Batch.findOne({ batchId })) || (await Batch.findById(batchId));
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const lab = await LabReport.create({
      batch: batch._id,
      uploader: req.user?._id || null,
      ipfsHash: ipfsResult.cid,
      filename: req.file?.originalname || req.body.filename || "report.pdf",
    });

    batch.labReports = batch.labReports || [];
    batch.labReports.push(lab._id);
    batch.status = "tested";
    await batch.save();

    // TODO: write lab CID to blockchain
    res.json({ success: true, lab, ipfsResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading lab report" });
  }
};

export const updateProcessing = async (req, res) => {
  try {
    const { batchId, stage } = req.body;
    const batch =
      (await Batch.findOne({ batchId })) || (await Batch.findById(batchId));
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.status = stage; // e.g. dried, powdered, formulated
    await batch.save();
    // TODO: push stage to blockchain
    res.json({ success: true, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating processing stage" });
  }
};
