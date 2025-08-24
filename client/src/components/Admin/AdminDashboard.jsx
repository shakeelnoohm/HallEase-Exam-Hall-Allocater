import React from "react";
import DashboardCard from "../Common/DashboardCard";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <DashboardCard title="Add Class" link="/admin/add-class" />
        <DashboardCard title="Add Room" link="/admin/add-room" />
        <DashboardCard title="Add Student" link="/admin/add-student" />
        <DashboardCard title="Allot Exam Hall" link="/admin/allotment" />
      </div>
    </div>
  );
}
