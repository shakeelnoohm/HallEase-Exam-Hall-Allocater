import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const emptyForm = { name: "", email: "", phone: "", department: "", employeeId: "", password: "", role: "invigilator" };

export default function ManageInvigilators() {
  const { darkMode } = useTheme();
  const [invigilators, setInvigilators] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [assigning, setAssigning] = useState({ invigilatorId: null, roomId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [iRes, rRes] = await Promise.all([
        API.get("/invigilator"),
        API.get("/room")
      ]);
      setInvigilators(iRes.data);
      setRooms(rRes.data);
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await API.post("/invigilator", form);
      setMsg({ type: "success", text: "Invigilator created successfully!" });
      setForm(emptyForm);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error creating invigilator" });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (invigilatorId, roomId) => {
    if (!roomId) return;
    try {
      await API.post("/invigilator/assign", { invigilatorId, roomId });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning invigilator");
    }
  };

  return (
    <AdminLayout title="Manage Invigilators">
      <div className="space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{invigilators.length} invigilator(s)</p>
          <button
            onClick={() => { setShowForm(!showForm); setMsg(null); }}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "+ Add Invigilator"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 shadow-sm space-y-4 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-semibold text-base mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>New Invigilator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Prof. Sarah Johnson"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="prof@college.edu"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 ..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Employee ID</label>
                <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="e.g. TCH001"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Department</label>
                <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
                  <option value="invigilator">Invigilator</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Creating..." : "Create Invigilator"}
              </button>
            </div>
          </form>
        )}

        {/* Invigilators Table */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          {invigilators.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No invigilators added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200"}>
                  <tr>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Name</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Role</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Assigned Room</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invigilators.map((inv) => (
                    <tr key={inv._id} className={darkMode ? "divide-gray-700 text-gray-300" : "text-gray-600"}>
                      <td className={`px-5 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{inv.name}</td>
                      <td className="px-5 py-3">{inv.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${inv.role === "supervisor" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {inv.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {inv.assignedRooms?.[0]?.roomNo || (
                          <select
                            onChange={(e) => handleAssign(inv._id, e.target.value)}
                            className={`border rounded px-2 py-1 text-xs ${darkMode ? "bg-gray-800 border-gray-600" : ""}`}
                            defaultValue=""
                          >
                            <option value="">Assign Room...</option>
                            {rooms.map(r => <option key={r._id} value={r._id}>{r.roomNo}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {inv.assignedRooms?.[0]?.roomNo && (
                          <span className="text-green-600 text-xs font-medium">✓ Assigned</span>
                        )}
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
