import React, { useState } from "react";
import client from "../api/client";

export default function ConsumerView() {
  const [batchId, setBatchId] = useState("");
  const [record, setRecord] = useState(null);

  const check = async () => {
    try {
      const res = await client.get(`/api/consumer/scan/${batchId}`);
      setRecord(res.data);
    } catch (err) {
      alert("Not found");
      setRecord(null);
    }
  };

  return (
    <div className="py-10 px-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Consumer — Verify Product
      </h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-3">
          <input
            placeholder="Paste Batch ID or QR payload"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={check}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Check
          </button>
        </div>
      </div>

      {record && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">
            {record.batch.herbType} • {record.batch.batchId}
          </h3>
          <div className="mt-3 text-sm text-slate-600">
            Farmer: {record.batch.farmer?.name || "Unknown"}
          </div>
          <div className="mt-3">
            <div className="font-medium">Herb Passport</div>
            <ol className="mt-2 list-decimal ml-6 text-sm text-slate-700">
              {record.passport.map((p, i) => (
                <li key={i}>
                  {p.step} — {p.by || ""} —{" "}
                  {p.date ? new Date(p.date).toLocaleDateString() : "TBD"}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
