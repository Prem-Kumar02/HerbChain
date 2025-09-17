import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-emerald-700">
        HerbChain
      </Link>
      <div className="flex gap-6">
        <a href="#features" className="text-gray-700 hover:text-emerald-600">
          Features
        </a>
        <a href="#about" className="text-gray-700 hover:text-emerald-600">
          About
        </a>
        <a href="#contact" className="text-gray-700 hover:text-emerald-600">
          Contact
        </a>
      </div>
      <Link
        to="/select-role"
        className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700"
      >
        Get Started
      </Link>
    </nav>
  );
}
