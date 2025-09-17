// controllers/farmerController.js
import Batch from "../models/Batch.js";
import QRCode from "qrcode";

/**
 * Add a new batch (Farmer)
 * Body: herbType, quantityKg, photoUrl (optional), gps {lat,lng}, notes
 */
export const addBatch = async (req, res) => {
  try {
    const farmer = req.user;
    const { herbType, quantityKg, photoUrl, gps, notes } = req.body;
    if (!herbType || !quantityKg)
      return res
        .status(400)
        .json({ message: "Missing herbType or quantityKg" });

    const batchId = `BATCH-${Date.now()}-${
      Math.floor(Math.random() * 9000) + 1000
    }`;
    const payload = { batchId, farmerId: farmer._id.toString() };

    let qrDataUrl = null;
    try {
      qrDataUrl = await QRCode.toDataURL(JSON.stringify(payload));
    } catch (e) {
      console.warn("QR fail", e);
    }

    const batch = await Batch.create({
      batchId,
      farmer: farmer._id,
      herbType,
      quantityKg,
      photoUrl,
      gps,
      notes,
      qrPayload: JSON.stringify(payload),
    });

    // TODO: Write to Blockchain -> set batch.blockchainTx
    res.status(201).json({ success: true, batch, qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating batch" });
  }
};

export const getMyBatches = async (req, res) => {
  try {
    const farmer = req.user;
    const batches = await Batch.find({ farmer: farmer._id }).sort({
      createdAt: -1,
    });
    res.json({ batches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving batches" });
  }
};

export const getBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findOne({ batchId: id }).populate(
      "farmer",
      "name email"
    );
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json({ batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching batch" });
  }
};
