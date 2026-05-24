import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/admin/exams", label: "Manage Exams", icon: "📋" },
  { path: "/admin/rooms", label: "Exam Halls", icon: "🏫" },
  { path: "/admin/students", label: "Students", icon: "👥" },
  { path: "/admin/allocate", label: "Allocate Halls", icon: "🪑" },
];

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 min-h-screen flex flex-col shadow-xl">
        <div className="px-6 py-6 border-b border-blue-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-extrabold text-sm">H</span>
            </div>
            <span className="text-white font-bold text-lg">HallEase</span>
          </div>
          <p className="text-blue-300 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-white text-blue-900"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <div className="text-sm text-gray-500">
            Admin: <span className="font-semibold text-gray-700">
              {JSON.parse(localStorage.getItem("admin") || "{}").username || "Admin"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
