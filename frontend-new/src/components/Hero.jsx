import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-emerald-800 leading-tight"
        >
          Trust Ayurveda with{" "}
          <span className="text-emerald-600">Blockchain</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-slate-700"
        >
          HerbChain brings transparency, provenance and authenticity to
          Ayurvedic herbs — from farmer fields to consumer hands.
        </motion.p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/select-role"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-white border rounded-lg hover:bg-slate-100"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-100 to-teal-50 rounded-2xl p-8 shadow-lg">
        <img
          src="/images/hero.png"
          alt="Ayurveda herbs"
          className="rounded-xl object-cover h-64 w-full"
        />
      </div>
    </section>
  );
}
