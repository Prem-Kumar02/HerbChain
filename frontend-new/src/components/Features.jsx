import React from "react";
import { ShieldCheck, QrCode, Database } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-emerald-600" />,
    title: "Secure Blockchain",
    description:
      "Immutable record of every herb batch, ensuring trust and authenticity.",
  },
  {
    icon: <QrCode className="h-8 w-8 text-emerald-600" />,
    title: "Batch QR Tracking",
    description: "Scan QR codes to trace herb journey from farm to consumer.",
  },
  {
    icon: <Database className="h-8 w-8 text-emerald-600" />,
    title: "IPFS Storage",
    description: "All lab reports and certifications stored securely on IPFS.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-700">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
