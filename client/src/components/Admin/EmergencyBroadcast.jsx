import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const BROADCAST_TYPES = [
  { value: "EXAM_POSTPONED", label: "Exam Postponed", color: "bg-red-100 text-red-700" },
  { value: "VENUE_CHANGE", label: "Venue Change", color: "bg-orange-100 text-orange-700" },
  { value: "TIME_CHANGE", label: "Time Change", color: "bg-yellow-100 text-yellow-700" },
  { value: "WEATHER_ALERT", label: "Weather Alert", color: "bg-blue-100 text-blue-700" },
  { value: "SECURITY_ALERT", label: "Security Alert", color: "bg-purple-100 text-purple-700" },
  { value: "GENERAL", label: "General Notice", color: "bg-gray-100 text-gray-700" }
];

export default function EmergencyBroadcast() {
  const { darkMode } = useTheme();
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "GENERAL",
    priority: "HIGH",
    targetAudience: { allStudents: true, departments: [], semesters: [] },
    channels: { email: true, sms: false, push: false, inApp: true }
  });
  const [broadcasts, setBroadcasts] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await API.get("/emergency/broadcasts");
      setBroadcasts(res.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post("/emergency/broadcast", form);
      alert("Emergency broadcast sent successfully!");
      setForm({
        title: "",
        message: "",
        type: "GENERAL",
        priority: "HIGH",
        targetAudience: { allStudents: true, departments: [], semesters: [] },
        channels: { email: true, sms: false, push: false, inApp: true }
      });
      fetchBroadcasts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout title="Emergency Broadcast">
      <div className="space-y-6 max-w-4xl">
        {/* Broadcast Form */}
        <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚨</span>
            <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>Send Emergency Broadcast</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
                >
                  {BROADCAST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Exam Postponed Due to Weather"
                className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                placeholder="Enter the emergency message..."
                className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
              />
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <label className={`block text-xs font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Notification Channels</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.channels.email}
                    onChange={(e) => setForm({ ...form, channels: { ...form.channels, email: e.target.checked } })}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>📧 Email</span>
                </label>
                <label className="flex items-center gap-2 opacity-50 cursor-not-allowed" title="SMS not configured">
                  <input
                    type="checkbox"
                    checked={false}
                    disabled
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>📱 SMS (Disabled)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.channels.push}
                    onChange={(e) => setForm({ ...form, channels: { ...form.channels, push: e.target.checked } })}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>🔔 Push</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "🚨 Send Emergency Broadcast"}
            </button>
          </div>
        </form>

        {/* Previous Broadcasts */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <span className={`text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Previous Broadcasts</span>
          </div>
          {broadcasts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No broadcasts sent yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {broadcasts.map((b) => {
                const typeInfo = BROADCAST_TYPES.find(t => t.value === b.type) || BROADCAST_TYPES[5];
                return (
                  <div key={b._id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        b.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
                        b.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {b.priority}
                      </span>
                      <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(b.sentAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{b.title}</h4>
                    <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{b.message}</p>
                    <div className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Delivered: {b.deliveryStats?.emailSent || 0} emails
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
