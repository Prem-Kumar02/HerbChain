import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 bg-emerald-600 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Join the HerbChain Revolution?
      </h2>
      <p className="mb-8 text-lg">
        Be part of a transparent, trusted, and modern Ayurvedic supply chain.
      </p>
      <Link
        to="/select-role"
        className="px-6 py-3 bg-white text-emerald-700 rounded-lg shadow-lg hover:bg-slate-100"
      >
        Get Started
      </Link>
    </section>
  );
}
