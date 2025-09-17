import React, { useContext, useEffect, useRef, useState } from "react";
import client from "../api/client";
import { AuthContext } from "../context/AuthContext";

/*
Features:
- Voice commands (Web Speech API): "add batch", "history", "generate qr"
- Photo input (file->dataURL)
- GPS capture (geolocation)
- Submit POST /api/farmer/add-batch
- Get GET /api/farmer/history
*/

export default function FarmerDashboard() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ herbType: "", quantityKg: "", notes: "" });
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [batches, setBatches] = useState([]);
  const [qrImage, setQrImage] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    // voice setup
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "hi-IN"; // or en-US
      recognitionRef.current.onresult = (e) => {
        const text = e.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(text);
      };
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const handleVoiceStart = () => {
    if (!recognitionRef.current) return alert("Voice not supported");
    setListening(true);
    recognitionRef.current.start();
  };

  const handleVoiceStop = () => {
    if (!recognitionRef.current) return;
    setListening(false);
    recognitionRef.current.stop();
  };

  const handleVoiceCommand = (txt) => {
    if (txt.includes("add batch") || txt.includes("नई बैच")) {
      document.getElementById("herb-input")?.focus();
    } else if (txt.includes("history") || txt.includes("इतिहास")) {
      document
        .getElementById("batches-list")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (txt.includes("generate qr") || txt.includes("क्यूआर")) {
      if (batches[0]) generateQrFor(batches[0].batchId);
    } else {
      // no op
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const captureGps = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) resolve({ lat: null, lng: null });
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { enableHighAccuracy: true, maximumAge: 60_000 }
      );
    });

  const submitBatch = async (e) => {
    e.preventDefault();
    try {
      const coords = await captureGps();
      const payload = {
        herbType: form.herbType,
        quantityKg: Number(form.quantityKg),
        photoUrl: photoDataUrl,
        gps: coords,
        notes: form.notes,
      };
      const res = await client.post("/api/farmer/add-batch", payload);
      alert("Batch created");
      // backend returns qrDataUrl and batch object in our earlier backend
      if (res.data.qrDataUrl) setQrImage(res.data.qrDataUrl);
      fetchHistory();
      setForm({ herbType: "", quantityKg: "", notes: "" });
      setPhotoDataUrl("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Create batch failed");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await client.get("/api/farmer/history");
      setBatches(res.data.batches || res.data.batches || []);
    } catch (err) {
      console.error(err);
    }
  };

  const generateQrFor = async (batchId) => {
    // This endpoint isn't separate — earlier backend returns qrDataUrl on batch creation.
    // We'll try to fetch batch and show its qrPayload if present.
    try {
      const res = await client.get(`/api/farmer/batch/${batchId}`);
      if (res.data.batch?.qrPayload) {
        // generate QR here from payload if needed, but backend returned qrDataUrl when creating.
        // For demo: show the batch.qrPayload as text and rely on server creation
        alert(
          "Batch found. Use QR returned at creation or recreate on server."
        );
      }
    } catch (err) {
      alert("Could not generate QR");
    }
  };

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Farmer Dashboard
      </h2>
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => (listening ? handleVoiceStop() : handleVoiceStart())}
          className={`px-4 py-2 rounded ${
            listening ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {listening ? "Listening..." : "Voice"}
        </button>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 rounded bg-white border"
        >
          Refresh History
        </button>
      </div>

      <form
        onSubmit={submitBatch}
        className="bg-white p-4 rounded-lg shadow mb-6"
      >
        <label className="block text-sm font-medium text-slate-700">
          Herb Type
        </label>
        <input
          id="herb-input"
          required
          value={form.herbType}
          onChange={(e) => setForm((f) => ({ ...f, herbType: e.target.value }))}
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="e.g. Ashwagandha"
        />
        <label className="block text-sm font-medium text-slate-700">
          Quantity (kg)
        </label>
        <input
          required
          value={form.quantityKg}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantityKg: e.target.value }))
          }
          type="number"
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <label className="block text-sm font-medium text-slate-700">
          Photo
        </label>
        <input
          accept="image/*"
          type="file"
          onChange={handlePhoto}
          className="mb-3"
        />
        {photoDataUrl && (
          <img
            src={photoDataUrl}
            className="w-36 h-36 object-cover rounded mb-3"
          />
        )}
        <label className="block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className="w-full border rounded px-3 py-2 mb-3"
          rows="2"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Submit Batch
          </button>
          <button
            type="button"
            onClick={async () => {
              const coords = await captureGps();
              alert(`GPS: ${coords.lat}, ${coords.lng}`);
            }}
            className="px-4 py-2 bg-white border rounded"
          >
            Capture GPS
          </button>
        </div>
      </form>

      {qrImage && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Generated QR</h3>
          <img src={qrImage} alt="qr" className="w-40 h-40" />
        </div>
      )}

      <div id="batches-list" className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Batch History</h3>
        {batches.length === 0 ? (
          <div className="text-slate-500">No batches yet.</div>
        ) : (
          <ul className="space-y-3">
            {batches.map((b) => (
              <li
                key={b._id}
                className="border rounded p-3 flex gap-3 items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">
                    {b.herbType}
                  </div>
                  <div className="text-sm text-slate-600">
                    {b.quantityKg} kg • {new Date(b.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    Status: {b.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">BatchId</div>
                  <div className="text-sm font-mono">{b.batchId}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
