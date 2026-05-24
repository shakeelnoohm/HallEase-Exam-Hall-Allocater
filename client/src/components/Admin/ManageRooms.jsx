import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNo: "", capacity: "", rows: "", cols: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/room");
      setRooms(res.data);
    } catch { }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await API.post("/room/add", {
        roomNo: form.roomNo,
        capacity: Number(form.capacity),
        rows: form.rows ? Number(form.rows) : undefined,
        cols: form.cols ? Number(form.cols) : undefined,
      });
      setMsg({ type: "success", text: "Room added successfully!" });
      setForm({ roomNo: "", capacity: "", rows: "", cols: "" });
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error adding room" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await API.delete(`/room/${id}`);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting room");
    }
  };

  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);

  return (
    <AdminLayout title="Exam Halls">
      <div className="space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-xs">Total Halls</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{rooms.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-xs">Total Seating Capacity</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalCapacity}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">{rooms.length} hall(s) registered</p>
          <button
            onClick={() => { setShowForm(!showForm); setMsg(null); }}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "+ Add Hall"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-base mb-4">New Exam Hall</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Hall / Room No.</label>
                <input name="roomNo" value={form.roomNo} onChange={handleChange} required placeholder="e.g. Hall A or 101"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required placeholder="e.g. 30" min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Columns per Row</label>
                <input type="number" name="cols" value={form.cols} onChange={handleChange} placeholder="e.g. 6 (default)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Rows will be auto-calculated from capacity ÷ columns.</p>
            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Adding..." : "Add Hall"}
              </button>
            </div>
          </form>
        )}

        {/* Rooms list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {rooms.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No halls added yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hall / Room</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Layout</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-800">{room.roomNo}</td>
                    <td className="px-5 py-3 text-gray-600">{room.capacity} seats</td>
                    <td className="px-5 py-3 text-gray-500">{room.rows} rows × {room.cols} cols</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(room._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
