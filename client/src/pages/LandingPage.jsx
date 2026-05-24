import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-800 font-extrabold text-lg">H</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">HallEase</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/student/login")}
            className="text-white border border-white/40 px-5 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-white text-blue-900 px-5 py-2 rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/40 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Exam Hall Management System
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
          Smart Seating for<br />
          <span className="text-blue-300">Stress-Free Exams</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mb-10 leading-relaxed">
          Automatically allocate exam halls for internal & university exams. Students from the same class are never seated side-by-side. Email notifications sent instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/student/login")}
            className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-50 transition shadow-lg"
          >
            Find My Seat
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-500 transition border border-blue-500 shadow-lg"
          >
            Admin Panel
          </button>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            { icon: "🎓", title: "Internal & University", desc: "Supports both internal assessments and university-level examinations" },
            { icon: "🪑", title: "Smart Seating", desc: "No two students of the same class sit adjacent — automatic interleaving" },
            { icon: "📧", title: "Email Notifications", desc: "Students receive hall & seat details instantly via email on allocation" },
          ].map((f) => (
            <div key={f.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-base mb-1">{f.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center text-blue-400/60 text-xs py-5">
        © 2024 HallEase — College Exam Hall Allocation System
      </footer>
    </div>
  );
}
