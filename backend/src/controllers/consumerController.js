// controllers/consumerController.js
import Batch from "../models/Batch.js";

/**
 * Public consumer scan: fetch by batchId
 * returns herb passport / timeline mock built from batch fields
 */
export const scanBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId }).populate("farmer", "name");
    if (!batch) return res.status(404).json({ message: "Not found" });

    // build simple passport timeline from fields:
    const passport = [
      {
        step: "Collected",
        by: batch.farmer?.name || "Farmer",
        date: batch.collectedAt,
      },
      ...(batch.labReports?.length
        ? [{ step: "Tested", by: "Lab", date: null }]
        : []),
      { step: "Processed", by: "Manufacturer", date: null },
      { step: "Packaged", by: "Exporter", date: null },
    ];

    res.json({ batch, passport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Scan error" });
  }
};
