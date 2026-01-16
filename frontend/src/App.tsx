import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Shinra</h1>
          <nav>
            <Link to="/login" className="mr-4 text-blue-600">Login</Link>
            <Link to="/dashboard" className="text-blue-600">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<div>Welcome to Shinra. Please <Link to="/login" className="text-blue-600">login</Link>.</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
