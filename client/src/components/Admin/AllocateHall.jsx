import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

export default function AllocateHall() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [sendEmails, setSendEmails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [examDetails, setExamDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, rRes] = await Promise.all([API.get("/exam"), API.get("/room")]);
        setExams(eRes.data);
        setRooms(rRes.data);
      } catch { }
    };
    fetchData();
  }, []);

  const handleExamChange = (e) => {
    const id = e.target.value;
    setSelectedExam(id);
    setMsg(null);
    const exam = exams.find((ex) => ex._id === id);
    setExamDetails(exam || null);
  };

  const toggleRoom = (id) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const totalSelectedCapacity = rooms
    .filter((r) => selectedRooms.includes(r._id))
    .reduce((s, r) => s + r.capacity, 0);

  const handleAllocate = async () => {
    if (!selectedExam) return setMsg({ type: "error", text: "Please select an exam." });
    setLoading(true);
    setMsg(null);
    try {
      const res = await API.post("/allotment/allocate", {
        examId: selectedExam,
        roomIds: selectedRooms.length > 0 ? selectedRooms : undefined,
        sendEmails,
      });
      setMsg({ type: "success", text: res.data.message });
      setExams((prev) => prev.map((e) => e._id === selectedExam ? { ...e, allocated: true } : e));
      setExamDetails((prev) => prev ? { ...prev, allocated: true } : prev);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Allocation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllotments = async () => {
    if (!selectedExam) return;
    if (!window.confirm("Delete all allotments for this exam and reset it?")) return;
    try {
      await API.delete(`/allotment/exam/${selectedExam}`);
      setMsg({ type: "success", text: "Allotments deleted. Exam reset." });
      setExams((prev) => prev.map((e) => e._id === selectedExam ? { ...e, allocated: false } : e));
      setExamDetails((prev) => prev ? { ...prev, allocated: false } : prev);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error deleting allotments" });
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout title="Allocate Exam Halls">
      <div className="space-y-6 max-w-3xl">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        {/* Step 1: Select exam */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-700 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
            Select Exam
          </h2>
          <select value={selectedExam} onChange={handleExamChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">— Choose an exam —</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                [{exam.examType === "university" ? "Univ." : "Internal"}] {exam.title} — {exam.subject} ({exam.department}, Sem {exam.semester}) — {formatDate(exam.examDate)}
              </option>
            ))}
          </select>

          {examDetails && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${examDetails.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {examDetails.examType === "university" ? "University Exam" : "Internal Exam"}
                </span>
                {examDetails.allocated && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">Already Allocated</span>}
              </div>
              <p className="text-gray-700"><strong>Subject:</strong> {examDetails.subject}</p>
              <p className="text-gray-700"><strong>Department:</strong> {examDetails.department} · Semester {examDetails.semester}</p>
              <p className="text-gray-700"><strong>Date:</strong> {formatDate(examDetails.examDate)} · {examDetails.startTime} – {examDetails.endTime}</p>
            </div>
          )}
        </div>

        {/* Step 2: Select rooms */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-700 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
            Select Exam Halls
            <span className="text-xs font-normal text-gray-400">(optional — leave unselected to use all halls)</span>
          </h2>
          {selectedRooms.length > 0 && (
            <p className="text-xs text-blue-600 mb-3">Selected capacity: {totalSelectedCapacity} seats</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {rooms.map((room) => (
              <button
                key={room._id}
                type="button"
                onClick={() => toggleRoom(room._id)}
                className={`border rounded-xl p-3 text-left transition ${selectedRooms.includes(room._id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
              >
                <p className="font-semibold text-gray-800 text-sm">{room.roomNo}</p>
                <p className="text-xs text-gray-500">{room.capacity} seats · {room.rows}×{room.cols}</p>
                {selectedRooms.includes(room._id) && <p className="text-blue-600 text-xs mt-1">✓ Selected</p>}
              </button>
            ))}
            {rooms.length === 0 && <p className="text-gray-400 text-sm col-span-3">No halls added yet. Go to Exam Halls to add rooms first.</p>}
          </div>
        </div>

        {/* Step 3: Email option & Allocate */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-700 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
            Email Notifications
          </h2>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setSendEmails(!sendEmails)}
              className={`w-11 h-6 rounded-full transition-colors relative ${sendEmails ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sendEmails ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-gray-700">
              Send allocation emails to all students
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-1.5 ml-14">Requires EMAIL_USER and EMAIL_PASS configured in server .env</p>
        </div>

        {/* Allocate button */}
        <div className="flex gap-3">
          <button
            onClick={handleAllocate}
            disabled={loading || !selectedExam || examDetails?.allocated}
            className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Allocating..." : examDetails?.allocated ? "Already Allocated" : "🪑 Generate Seating"}
          </button>

          {examDetails?.allocated && (
            <>
              <button
                onClick={() => navigate(`/admin/allotments/${selectedExam}`)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                View Seating Plan
              </button>
              <button
                onClick={handleDeleteAllotments}
                className="border border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Reset Allotments
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          <strong>Seating Algorithm:</strong> Students from the same department & semester are interleaved with students of other departments using round-robin. This guarantees <strong>no two students of the same class sit side-by-side</strong> in any row.
        </div>
      </div>
    </AdminLayout>
  );
}
