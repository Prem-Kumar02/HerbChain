import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import FarmerDashboard from "./pages/FarmerDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import ExporterDashboard from "./pages/ExporterDashboard";
import RegulatorDashboard from "./pages/RegulatorDashboard";
import ConsumerView from "./pages/ConsumerView";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/exporter" element={<ExporterDashboard />} />
        <Route path="/regulator" element={<RegulatorDashboard />} />
        <Route path="/consumer" element={<ConsumerView />} />
      </Routes>
    </div>
  );
}
