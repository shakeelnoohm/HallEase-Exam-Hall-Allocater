import React, { useEffect, useState } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({ icon, label, value, subtext, color }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`rounded-2xl p-5 shadow-sm border flex items-center gap-4 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
        <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{value ?? "—"}</p>
        {subtext && <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{subtext}</p>}
      </div>
    </div>
  );
};

export default function AnalyticsDashboard() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          API.get("/analytics/dashboard"),
          API.get("/analytics/conflicts")
        ]);
        setStats(sRes.data);
        setConflicts(cRes.data.conflicts);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleExport = (type) => {
    window.open(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/analytics/export/${type}`, "_blank");
  };

  const formatPercent = (n) => n ? `${n.toFixed(1)}%` : "—";

  return (
    <AdminLayout title="Analytics Dashboard">
      <div className="space-y-6">
        {/* Quick Export */}
        <div className={`flex flex-wrap gap-3 ${darkMode ? "text-gray-300" : ""}`}>
          <span className="text-sm font-medium py-2">Export Data:</span>
          <button onClick={() => handleExport("students")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">Students CSV</button>
          <button onClick={() => handleExport("exams")} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">Exams CSV</button>
          <button onClick={() => handleExport("allotments")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">Allotments CSV</button>
        </div>

        {loading ? (
          <div className={`rounded-2xl border p-10 text-center ${darkMode ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-white border-gray-200 text-gray-400"}`}>
            Loading analytics...
          </div>
        ) : stats ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="👥" label="Total Students" value={stats.overview?.totalStudents} color="bg-blue-50" />
              <StatCard icon="🏫" label="Exam Halls" value={stats.overview?.totalRooms} color="bg-purple-50" />
              <StatCard icon="📋" label="Total Exams" value={stats.overview?.totalExams} subtext={`${stats.overview?.upcomingExams} upcoming`} color="bg-yellow-50" />
              <StatCard icon="✅" label="Allocated" value={stats.overview?.allocatedExams} subtext={`of ${stats.overview?.totalExams}`} color="bg-green-50" />
            </div>

            {/* Exam Types & Accommodations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Exam Types</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Internal Exams</span>
                    <span className="font-semibold text-blue-600">{stats.overview?.internalExams || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.overview?.internalExams / (stats.overview?.totalExams || 1)) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>University Exams</span>
                    <span className="font-semibold text-purple-600">{stats.overview?.universityExams || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats.overview?.universityExams / (stats.overview?.totalExams || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Special Accommodations</h3>
                <div className="space-y-2">
                  {[
                    { label: "Wheelchair Access", count: stats.accommodations?.wheelchair, color: "text-blue-600" },
                    { label: "Extra Time", count: stats.accommodations?.extraTime, color: "text-green-600" },
                    { label: "Scribe Required", count: stats.accommodations?.scribe, color: "text-orange-600" },
                    { label: "Front Row Seating", count: stats.accommodations?.frontRow, color: "text-purple-600" }
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.count || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Distribution */}
            <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Students by Department</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.deptDistribution?.map(dept => (
                  <div key={dept._id} className={`p-3 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{dept._id}</p>
                    <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{dept.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Utilization */}
            {stats.roomUtilization?.length > 0 && (
              <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Room Utilization (Last 30 Days)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      <tr>
                        <th className="text-left py-2">Room</th>
                        <th className="text-left py-2">Capacity</th>
                        <th className="text-left py-2">Students</th>
                        <th className="text-left py-2">Utilization</th>
                      </tr>
                    </thead>
                    <tbody className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      {stats.roomUtilization.map(r => (
                        <tr key={r.roomNo}>
                          <td className="py-2 font-medium">{r.roomNo}</td>
                          <td>{r.capacity}</td>
                          <td>{r.totalStudents}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${r.utilizationRate > 90 ? "bg-red-500" : r.utilizationRate > 70 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(r.utilizationRate, 100)}%` }}></div>
                              </div>
                              <span className="text-xs">{formatPercent(r.utilizationRate)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Peak Days */}
            {stats.peakDays?.length > 0 && (
              <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Peak Exam Days (Next 30 Days)</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.peakDays.map(day => (
                    <div key={day._id} className={`px-4 py-2 rounded-lg ${day.examCount > 2 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      <span className="text-sm font-medium">{new Date(day._id).toLocaleDateString()}</span>
                      <span className="text-xs ml-2">({day.examCount} exams)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts Alert */}
            {conflicts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  ⚠️ Exam Conflicts Detected ({conflicts.length})
                </h3>
                <div className="space-y-3">
                  {conflicts.map((c, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-red-100">
                      <p className="text-sm text-red-700">
                        <strong>{c.exam1.title}</strong> ({c.exam1.time}) overlaps with <strong>{c.exam2.title}</strong> ({c.exam2.time})
                      </p>
                      <p className="text-xs text-red-600 mt-1">Conflicting students: {c.students.length}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
