import React, { useState } from "react";
import client from "../api/client";

export default function ManufacturerDashboard() {
  const [batchId, setBatchId] = useState("");
  const [found, setFound] = useState(null);
  const [file, setFile] = useState(null);

  const verify = async () => {
    try {
      const res = await client.post("/api/manufacturer/receive", { batchId });
      setFound(res.data.batch);
      alert("Batch received (mock).");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const uploadLab = async () => {
    if (!file) return alert("Select file");
    const fd = new FormData();
    fd.append("batchId", batchId);
    fd.append("file", file);
    try {
      const res = await client.post("/api/manufacturer/upload-lab", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lab uploaded: " + res.data.ipfsResult?.cid || res.data.lab?._id);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateStage = async (stage) => {
    try {
      const res = await client.post("/api/manufacturer/process", {
        batchId,
        stage,
      });
      alert("Stage updated");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Manufacturer Dashboard
      </h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-3">
          <input
            placeholder="Paste batchId or scanned payload"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={verify}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Verify & Receive
          </button>
        </div>
        {found && (
          <div className="mt-4">
            Found: <b>{found.herbType}</b> • {found.quantityKg}kg
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Upload Lab Report</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={uploadLab}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Upload
          </button>
          <button
            onClick={() => updateStage("processed")}
            className="px-4 py-2 bg-white border rounded"
          >
            Mark Processed
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Recent Activity (mock)</h3>
        <div className="text-sm text-slate-600">
          No live activity connected yet.
        </div>
      </div>
    </div>
  );
}
