import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 py-6 mt-10 text-center text-slate-600 text-sm">
      <p>© {new Date().getFullYear()} HerbChain. All rights reserved.</p>
    </footer>
  );
}
