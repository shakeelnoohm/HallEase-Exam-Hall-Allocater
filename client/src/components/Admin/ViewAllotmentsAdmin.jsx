import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

export default function ViewAllotmentsAdmin() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [allotments, setAllotments] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterRoom, setFilterRoom] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, eRes] = await Promise.all([
          API.get(`/allotment/exam/${examId}`),
          API.get(`/exam/${examId}`),
        ]);
        setAllotments(aRes.data);
        setExam(eRes.data);
      } catch (err) {
        setMsg({ type: "error", text: "Failed to load allotments" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  const handleSendEmails = async () => {
    setSendingEmails(true);
    setMsg(null);
    try {
      const res = await API.post(`/allotment/send-emails/${examId}`);
      setMsg({ type: "success", text: res.data.message });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error sending emails" });
    } finally {
      setSendingEmails(false);
    }
  };

  const rooms = [...new Set(allotments.map((a) => a.roomId?.roomNo).filter(Boolean))];
  const filtered = filterRoom ? allotments.filter((a) => a.roomId?.roomNo === filterRoom) : allotments;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

  return (
    <AdminLayout title="Seating Plan">
      <div className="space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        <button onClick={() => navigate("/admin/allocate")} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
          ← Back to Allocate
        </button>

        {exam && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${exam.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {exam.examType === "university" ? "University Exam" : "Internal Exam"}
                  </span>
                </div>
                <h2 className="font-bold text-gray-800 text-lg">{exam.title}</h2>
                <p className="text-gray-500 text-sm">{exam.subject} · {exam.department} · Semester {exam.semester}</p>
                <p className="text-gray-500 text-sm">{formatDate(exam.examDate)} · {exam.startTime} – {exam.endTime}</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl">
                  {allotments.length} students allocated
                </span>
                <button
                  onClick={handleSendEmails}
                  disabled={sendingEmails}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60"
                >
                  {sendingEmails ? "Sending..." : "📧 Send Emails"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter by room */}
        {rooms.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setFilterRoom("")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${!filterRoom ? "bg-blue-700 text-white border-blue-700" : "border-gray-300 text-gray-600 hover:border-blue-300"}`}>
              All Halls
            </button>
            {rooms.map((r) => (
              <button key={r} onClick={() => setFilterRoom(r)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${filterRoom === r ? "bg-blue-700 text-white border-blue-700" : "border-gray-300 text-gray-600 hover:border-blue-300"}`}>
                {r}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">No allotments found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sem</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hall</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seat</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a, i) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{a.studentId?.name}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{a.studentId?.rollNo}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{a.studentId?.department}</td>
                      <td className="px-4 py-3 text-gray-600">{a.studentId?.semester}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">{a.roomId?.roomNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded font-mono">{a.seatNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        {a.emailSent
                          ? <span className="text-green-600 text-xs font-medium">✓ Sent</span>
                          : <span className="text-gray-400 text-xs">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
