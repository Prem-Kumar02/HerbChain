import React, { useState } from "react";
import client from "../api/client";

export default function RegulatorDashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      const res = await client.post("/api/regulator/verify", {
        batchId: query,
      });
      setResult(res.data.batch);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const certify = async (action) => {
    try {
      const res = await client.post("/api/regulator/certify", {
        batchId: result.batchId,
        action,
      });
      alert("Updated");
      setResult(res.data.batch);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Regulator Dashboard
      </h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-3">
          <input
            placeholder="Enter Batch ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={verify}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Verify
          </button>
        </div>

        {result && (
          <div className="mt-4">
            <div className="font-semibold">
              {result.herbType} • {result.quantityKg} kg
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => certify("certify")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => certify("reject")}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Analytics (mock)</h3>
        <button
          onClick={async () => {
            const r = await client.get("/api/regulator/analytics");
            alert(JSON.stringify(r.data));
          }}
          className="px-3 py-2 bg-white border rounded"
        >
          Fetch Analytics
        </button>
      </div>
    </div>
  );
}
