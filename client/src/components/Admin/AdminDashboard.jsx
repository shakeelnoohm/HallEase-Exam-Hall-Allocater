import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-blue-700 w-full text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-3/4">
        <button
          onClick={() => navigate("/admin/addclass")}
          className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 text-lg font-semibold"
        >
          ➕ Add Class
        </button>

        <button
          onClick={() => navigate("/admin/addroom")}
          className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 text-lg font-semibold"
        >
          🏫 Add Room
        </button>

        <button
          onClick={() => navigate("/admin/addstudent")}
          className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 text-lg font-semibold"
        >
          👩‍🎓 Add Student
        </button>

        <button
          onClick={() => navigate("/admin/allotment")}
          className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 text-lg font-semibold"
        >
          🪑 Allocate Exam Hall
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
