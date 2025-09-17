import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    id: "farmer",
    label: "Farmer",
    desc: "Upload batch, generate QR, voice-first",
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    desc: "Receive batches, upload lab tests",
  },
  {
    id: "exporter",
    label: "Exporter",
    desc: "Package, create shipments & track",
  },
  { id: "regulator", label: "Regulator", desc: "Verify & certify batches" },
  { id: "consumer", label: "Consumer", desc: "Scan QR & verify product" },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">Select your role</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <div className="flex-1">
                <div className="text-lg font-semibold">{r.label}</div>
                <div className="text-sm text-slate-600 mt-2">{r.desc}</div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() =>
                    navigate(r.id === "consumer" ? "/consumer" : `/${r.id}`)
                  }
                  className="px-4 py-2 bg-emerald-600 text-white rounded"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
