// controllers/regulatorController.js
import Batch from "../models/Batch.js";

/**
 * Verify batch (fetch by id)
 */
export const verifyBatch = async (req, res) => {
  try {
    const { batchId } = req.body;
    const batch = await Batch.findOne({ batchId }).populate(
      "farmer",
      "name email"
    );
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json({ success: true, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying batch" });
  }
};

/**
 * Certify or reject
 */
export const certifyBatch = async (req, res) => {
  try {
    const { batchId, action } = req.body; // action: 'certify' | 'reject'
    const batch = await Batch.findOne({ batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.status = action === "certify" ? "certified" : "rejected";
    await batch.save();

    // TODO: store regulator signature on blockchain if required
    res.json({ success: true, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error certifying batch" });
  }
};

export const analytics = async (req, res) => {
  try {
    const total = await Batch.countDocuments();
    const certified = await Batch.countDocuments({ status: "certified" });
    const rejected = await Batch.countDocuments({ status: "rejected" });
    res.json({ total, certified, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};
