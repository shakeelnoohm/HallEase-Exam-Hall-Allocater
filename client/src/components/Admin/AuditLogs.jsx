import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const severityColors = {
  INFO: "bg-blue-100 text-blue-700",
  WARNING: "bg-yellow-100 text-yellow-700",
  CRITICAL: "bg-red-100 text-red-700"
};

const actionIcons = {
  CREATE: "+",
  UPDATE: "✎",
  DELETE: "🗑",
  LOGIN: "🔑",
  LOGOUT: "🚪",
  EXPORT: "📊",
  ALLOCATE: "🪑",
  EMAIL_SEND: "📧",
  ATTENDANCE_MARK: "✓",
  EMERGENCY_BROADCAST: "🚨"
};

export default function AuditLogs() {
  const { darkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    severity: "",
    startDate: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters, page]);

  const fetchLogs = async () => {
    try {
      const params = { page, limit: 50, ...filters };
      const res = await API.get("/audit/logs", { params });
      setLogs(res.data.logs);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/audit/stats");
      setStats(res.data);
    } catch {}
  };

  return (
    <AdminLayout title="Audit Logs">
      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.actionStats?.map(stat => (
              <div key={stat._id} className={"p-4 rounded-xl shadow-sm " + (darkMode ? "bg-gray-900" : "bg-white")}>
                <div className="text-2xl">{actionIcons[stat._id] || "📋"}</div>
                <p className={"text-2xl font-bold " + (darkMode ? "text-white" : "text-gray-800")}>{stat.count}</p>
                <p className={"text-xs " + (darkMode ? "text-gray-400" : "text-gray-500")}>{stat._id}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className={"p-4 rounded-xl shadow-sm " + (darkMode ? "bg-gray-900" : "bg-white")}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className={"border rounded-lg px-3 py-2 text-sm " + (darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300")}
            >
              <option value="">All Actions</option>
              {Object.keys(actionIcons).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select
              value={filters.entity}
              onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
              className={"border rounded-lg px-3 py-2 text-sm " + (darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300")}
            >
              <option value="">All Entities</option>
              <option value="Student">Student</option>
              <option value="Exam">Exam</option>
              <option value="Room">Room</option>
              <option value="Allotment">Allotment</option>
            </select>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className={"border rounded-lg px-3 py-2 text-sm " + (darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300")}
            >
              <option value="">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
             className={"border rounded-lg px-3 py-2 text-sm " + (darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300")}
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className={"border rounded-lg px-3 py-2 text-sm " + (darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300")}
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className={"rounded-xl overflow-hidden shadow-sm " + (darkMode ? "bg-gray-900" : "bg-white")}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                <tr>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>Time</th>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>Action</th>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>Entity</th>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>Description</th>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>User</th>
                  <th className={"px-4 py-3 text-left text-xs font-semibold " + (darkMode ? "text-gray-400" : "text-gray-500")}>Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log._id} className={darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}>
                    <td className={"px-4 py-3 text-xs " + (darkMode ? "text-gray-400" : "text-gray-500")}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg mr-2">{actionIcons[log.action] || "📋"}</span>
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{log.action}</span>
                    </td>
                    <td className={"px-4 py-3 " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                      {log.entity}
                    </td>
                    <td className={"px-4 py-3 max-w-md truncate " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                      {log.description}
                    </td>
                    <td className={"px-4 py-3 text-xs " + (darkMode ? "text-gray-400" : "text-gray-500")}>
                      {log.performedBy?.username || "System"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={"px-2 py-1 rounded text-xs font-semibold " + severityColors[log.severity]}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
