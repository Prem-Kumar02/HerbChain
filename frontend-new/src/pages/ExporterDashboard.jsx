import React, { useState } from "react";
import client from "../api/client";

export default function ExporterDashboard() {
  const [batchId, setBatchId] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState("");
  const [shipments, setShipments] = useState([]);

  const packageBatch = async () => {
    try {
      const res = await client.post("/api/distributor/package", {
        batchId,
        shipmentDetails,
      });
      alert("Packaged");
      setShipments((prev) => [res.data.shipment, ...prev]);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const addCheckpoint = async (shipmentId) => {
    const lat = prompt("Enter lat") || "";
    const lng = prompt("Enter lng") || "";
    try {
      const res = await client.post("/api/distributor/transport", {
        shipmentId,
        lat,
        lng,
      });
      alert("Checkpoint logged");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Exporter Dashboard
      </h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <input
          placeholder="Shipment details"
          value={shipmentDetails}
          onChange={(e) => setShipmentDetails(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <div className="flex gap-3">
          <button
            onClick={packageBatch}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Package & Ship
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Active Shipments</h3>
        {shipments.length === 0 ? (
          <div className="text-slate-500">No active shipments</div>
        ) : (
          <ul className="space-y-3">
            {shipments.map((s) => (
              <li
                key={s._id}
                className="border rounded p-3 flex justify-between"
              >
                <div>
                  {s.batch} • {s.status}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCheckpoint(s._id)}
                    className="px-3 py-1 bg-white border rounded"
                  >
                    Add Checkpoint
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
