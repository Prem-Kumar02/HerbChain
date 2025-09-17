// controllers/distributorController.js
import Batch from "../models/Batch.js";
import Shipment from "../models/Shipment.js";
import { mockUploadToIpfs } from "../utils/ipfs.js";

/**
 * Package & Ship
 * body: batchId, docsHash (optional) or multer file
 */
export const packageBatch = async (req, res) => {
  try {
    const { batchId, shipmentDetails } = req.body;
    const batch =
      (await Batch.findOne({ batchId })) || (await Batch.findById(batchId));
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    // If file uploaded -> mock ipfs
    let doc = null;
    if (req.file) {
      doc = await mockUploadToIpfs(
        req.file.buffer || Buffer.from(req.file.path || ""),
        req.file.originalname || req.file.filename
      );
    } else if (req.body.docsHash) {
      doc = {
        cid: req.body.docsHash,
        url: `https://ipfs.io/ipfs/${req.body.docsHash}`,
      };
    }

    const shipment = await Shipment.create({
      batch: batch._id,
      exporter: req.user?._id || null,
      docs: doc
        ? [{ ipfsHash: doc.cid, filename: req.file?.originalname || "doc" }]
        : [],
      checkpoints: [],
      status: "packaged",
    });

    batch.status = "packaged";
    batch.shipmentDetails = shipmentDetails || "";
    await batch.save();

    res.json({ success: true, shipment, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error packaging batch" });
  }
};

export const logTransport = async (req, res) => {
  try {
    const { shipmentId, lat, lng, note } = req.body;
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    shipment.checkpoints.push({
      gps: { lat: Number(lat), lng: Number(lng) },
      time: new Date(),
    });
    await shipment.save();

    // also add to batch transport logs
    const batch = await Batch.findById(shipment.batch);
    if (batch) {
      batch.transportLogs = batch.transportLogs || [];
      batch.transportLogs.push({
        gps: { lat: Number(lat), lng: Number(lng), note },
        time: new Date(),
      });
      await batch.save();
    }

    res.json({ success: true, shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging transport" });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    shipment.status = "delivered";
    await shipment.save();

    const batch = await Batch.findById(shipment.batch);
    if (batch) {
      batch.status = "exported";
      await batch.save();
    }

    res.json({ success: true, shipment, batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking delivered" });
  }
};
