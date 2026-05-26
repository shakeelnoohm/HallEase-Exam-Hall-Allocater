import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function ManageRooms() {
  const { darkMode } = useTheme();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNo: "", capacity: "", rows: "", cols: "", floor: "1", hasAccessibility: false });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [blockingRoom, setBlockingRoom] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockReason, setBlockReason] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await API.get("/room");
      setRooms(res.data);
    } catch { }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Halls</p>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>{rooms.length}</p>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Seating Capacity</p>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>{totalCapacity}</p>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Accessible Halls</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{rooms.filter(r => r.hasAccessibility).length}</p>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Blocked Seats</p>
            <p className="text-2xl font-bold mt-1 text-red-600">{rooms.reduce((sum, r) => sum + (r.blockedSeats?.length || 0), 0)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{rooms.length} hall(s) registered</p>
          <button
            onClick={() => { setShowForm(!showForm); setMsg(null); }}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "+ Add Hall"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-semibold text-base mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>New Exam Hall</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="col-span-2">
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Hall / Room No.</label>
                <input name="roomNo" value={form.roomNo} onChange={handleChange} required placeholder="e.g. Hall A or 101"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required placeholder="e.g. 30" min="1"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Columns</label>
                <input type="number" name="cols" value={form.cols} onChange={handleChange} placeholder="e.g. 6"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Floor</label>
                <input type="number" name="floor" value={form.floor} onChange={handleChange} min="0"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" id="hasAccessibility" name="hasAccessibility" checked={form.hasAccessibility} onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded" />
              <label htmlFor="hasAccessibility" className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Wheelchair accessible / Ground floor</label>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Rows will be auto-calculated from capacity ÷ columns.</p>
            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Adding..." : "Add Hall"}
              </button>
            </div>
          </form>
        )}

        {/* Rooms list */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          {rooms.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No halls added yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className={darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200"}>
                <tr>
                  <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Hall / Room</th>
                  <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Floor</th>
                  <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Capacity</th>
                  <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Layout</th>
                  <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Blocked</th>
                  <th className={`px-5 py-3 text-right text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room._id} className={darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-600"}>
                    <td className={`px-5 py-3 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {room.roomNo}
                      {room.hasAccessibility && <span className="ml-2 text-green-500 text-xs">♿</span>}
                    </td>
                    <td className="px-5 py-3">{room.floor || 1}</td>
                    <td className="px-5 py-3">{room.capacity} seats</td>
                    <td className="px-5 py-3">{room.rows}×{room.cols}</td>
                    <td className="px-5 py-3">
                      {room.blockedSeats?.length > 0 ? (
                        <span className="text-red-500 text-xs font-medium">{room.blockedSeats.length} seats</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button onClick={() => { setBlockingRoom(room); setSelectedSeats(room.blockedSeats || []); setBlockReason(""); }}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition">
                        Block Seats
                      </button>
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

        {/* Seat Blocking Modal */}
        {blockingRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
              <h3 className={`font-semibold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Block Seats in {blockingRoom.roomNo}
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Click on seats to block/unblock them. Blocked seats won't be assigned to students.
              </p>
              <div className="mb-4">
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Reason (optional)</label>
                <input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Broken bench, Teacher desk"
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${blockingRoom.cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: blockingRoom.rows * blockingRoom.cols }, (_, i) => {
                  const row = Math.floor(i / blockingRoom.cols) + 1;
                  const col = (i % blockingRoom.cols) + 1;
                  const isBlocked = selectedSeats.some(s => s.row === row && s.col === col);
                  const colLabel = String.fromCharCode(64 + col);
                  return (
                    <button key={i} onClick={() => {
                      if (isBlocked) {
                        setSelectedSeats(selectedSeats.filter(s => !(s.row === row && s.col === col)));
                      } else {
                        setSelectedSeats([...selectedSeats, { row, col, reason: blockReason || "Blocked" }]);
                      }
                    }}
                      className={`aspect-square rounded-lg text-xs font-medium transition ${
                        isBlocked ? "bg-red-500 text-white" : (darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                      }`}>
                      R{row}{colLabel}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setBlockingRoom(null)} className={`px-5 py-2 rounded-lg text-sm font-medium ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"}`}>
                  Cancel
                </button>
                <button onClick={async () => {
                  try {
                    await API.post(`/room/${blockingRoom._id}/block`, { seats: selectedSeats, reason: blockReason });
                    fetchRooms();
                    setBlockingRoom(null);
                  } catch (err) {
                    alert(err.response?.data?.message || "Error blocking seats");
                  }
                }} className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
