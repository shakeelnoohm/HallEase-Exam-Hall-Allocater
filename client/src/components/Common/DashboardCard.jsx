import React from "react";
import { Link } from "react-router-dom";

export default function DashboardCard({ title, link }) {
  return (
    <Link
      to={link}
      className="p-6 shadow-md rounded-lg bg-gray-100 hover:bg-gray-200"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
    </Link>
  );
}
