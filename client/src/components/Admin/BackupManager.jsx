import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function BackupManager() {
  const { darkMode } = useTheme();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const res = await API.get("/backup");
      setBackups(res.data);
    } catch {}
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      await API.post("/backup", { type: "MANUAL" });
      alert("Backup started! Check back in a moment.");
      setTimeout(fetchBackups, 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Backup failed");
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (id) => {
    if (!window.confirm("WARNING: This will replace all current data with the backup. Continue?")) return;
    setRestoring(id);
    try {
      await API.post(`/backup/restore/${id}`);
      alert("Restore completed!");
    } catch (err) {
      alert(err.response?.data?.message || "Restore failed");
    } finally {
      setRestoring(null);
    }
  };

  const deleteBackup = async (id) => {
    if (!window.confirm("Delete this backup permanently?")) return;
    try {
      await API.delete(`/backup/${id}`);
      fetchBackups();
    } catch {}
  };

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <AdminLayout title="Backup & Restore">
      <div className="space-y-6 max-w-4xl">
        {/* Create Backup */}
        <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💾</span>
            <div>
              <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>Create Backup</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Backup all student, exam, and allocation data</p>
            </div>
          </div>
          <button
            onClick={createBackup}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create New Backup"}
          </button>
        </div>

        {/* Backup List */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <span className={`text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Backup History</span>
          </div>
          {backups.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No backups found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Date</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Type</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Size</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Records</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                    <th className={`px-4 py-3 text-right text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {backups.map((b) => (
                    <tr key={b._id} className={darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}>
                      <td className={`px-4 py-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{b.type}</td>
                      <td className={`px-4 py-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{formatSize(b.fileSize)}</td>
                      <td className={`px-4 py-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {b.recordCounts?.students || 0} students, {b.recordCounts?.exams || 0} exams
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                          b.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {b.status === "COMPLETED" && (
                          <>
                            <a
                              href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/backup/download/${b._id}?token=${localStorage.getItem("token")}`}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => restoreBackup(b._id)}
                              disabled={restoring === b._id}
                              className="text-orange-600 hover:text-orange-800 text-xs font-medium disabled:opacity-60"
                            >
                              {restoring === b._id ? "Restoring..." : "Restore"}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteBackup(b._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
