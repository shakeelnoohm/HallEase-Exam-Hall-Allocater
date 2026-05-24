import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  </div>
);

const QuickLink = ({ icon, label, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition text-left w-full"
  >
    <div className="text-2xl mb-2">{icon}</div>
    <p className="font-semibold text-gray-800 text-sm">{label}</p>
    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
  </button>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: null, rooms: null, exams: null });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, rRes, eRes] = await Promise.all([
          API.get("/student"),
          API.get("/room"),
          API.get("/exam"),
        ]);
        setStats({
          students: sRes.data.length,
          rooms: rRes.data.length,
          exams: eRes.data.length,
          allocated: eRes.data.filter((e) => e.allocated).length,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Total Students" value={stats.students} color="bg-blue-50" />
          <StatCard icon="🏫" label="Exam Halls" value={stats.rooms} color="bg-purple-50" />
          <StatCard icon="📋" label="Total Exams" value={stats.exams} color="bg-yellow-50" />
          <StatCard icon="✅" label="Allocated Exams" value={stats.allocated} color="bg-green-50" />
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink icon="📋" label="Manage Exams" desc="Add internal & university exams" onClick={() => navigate("/admin/exams")} />
            <QuickLink icon="🏫" label="Exam Halls" desc="Add rooms with capacity" onClick={() => navigate("/admin/rooms")} />
            <QuickLink icon="�" label="Students" desc="Add and manage students" onClick={() => navigate("/admin/students")} />
            <QuickLink icon="🪑" label="Allocate Halls" desc="Generate seating & send emails" onClick={() => navigate("/admin/allocate")} />
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h3 className="font-semibold text-blue-800 text-sm mb-1">How Seating Works</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            When you allocate an exam hall, students from the same department & semester are <strong>interleaved</strong> with students from other classes. This ensures <strong>no two students of the same class sit side-by-side</strong>. Seats are assigned in a row-column grid (e.g. R1A, R1B…).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
