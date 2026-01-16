import React, { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [key, setKey] = useState("");
  const [artifact, setArtifact] = useState<string | null>(null);

  async function activate() {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_BASE}/keys/activate`, { key }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Activated");
    } catch (err) {
      alert("Activation failed");
    }
  }

  async function downloadArtifact() {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get(`${import.meta.env.VITE_API_BASE}/keys/artifact/example.lua?key=${key}`, { headers: { Authorization: `Bearer ${token}` } });
      const signature = resp.headers["x-shinra-signature"];
      setArtifact(`Signature: ${signature}\n\n${resp.data}`);
    } catch (err) {
      alert("Download failed");
    }
  }

  return (
    <div>
      <h2 className="text-lg mb-4">Dashboard</h2>

      <div className="mb-4">
        <label className="block text-sm">License Key</label>
        <input value={key} onChange={e => setKey(e.target.value)} className="w-full border px-3 py-2" />
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={activate} className="bg-green-600 text-white px-3 py-2 rounded">Activate</button>
        <button onClick={downloadArtifact} className="bg-blue-600 text-white px-3 py-2 rounded">Download Example Artifact</button>
      </div>

      {artifact && (
        <pre className="bg-black text-white p-4 rounded whitespace-pre-wrap">{artifact}</pre>
      )}
    </div>
  );
}
