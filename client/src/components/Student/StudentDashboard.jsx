import React from "react";
import DashboardCard from "../Common/DashboardCard";

export default function StudentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <DashboardCard title="View Allotment" link="/student/view-allotment" />
      </div>
    </div>
  );
}
