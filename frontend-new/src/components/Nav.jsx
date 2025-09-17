import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-emerald-700">
            🌿 HerbChain
          </Link>
          <nav className="hidden md:flex gap-4 text-sm text-slate-600">
            <Link to="/farmer" className="hover:text-emerald-600">
              Farmer
            </Link>
            <Link to="/manufacturer" className="hover:text-emerald-600">
              Manufacturer
            </Link>
            <Link to="/exporter" className="hover:text-emerald-600">
              Exporter
            </Link>
            <Link to="/regulator" className="hover:text-emerald-600">
              Regulator
            </Link>
            <Link to="/consumer" className="hover:text-emerald-600">
              Consumer
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-slate-700">
                {user.name} • {user.role}
              </div>
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="px-3 py-2 bg-slate-100 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/select-role"
                className="px-3 py-2 bg-emerald-600 text-white rounded"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
