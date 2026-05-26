import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function ViewAllotmentsAdmin() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [allotments, setAllotments] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterRoom, setFilterRoom] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);

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
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${exam.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {exam.examType === "university" ? "University Exam" : "Internal Exam"}
                  </span>
                </div>
                <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>{exam.title}</h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{exam.subject} · {exam.department} · Semester {exam.semester}</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{formatDate(exam.examDate)} · {exam.startTime} – {exam.endTime}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className={`text-sm font-semibold px-4 py-2 rounded-xl ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
                  {allotments.length} students allocated
                </span>
                <a
                  href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/pdf/seating-chart/${examId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2"
                >
                  📄 Seating PDF
                </a>
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
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${!filterRoom ? "bg-blue-700 text-white border-blue-700" : (darkMode ? "border-gray-600 text-gray-400 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-300")}`}>
              All Halls
            </button>
            {rooms.map((r) => (
              <button key={r} onClick={() => setFilterRoom(r)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${filterRoom === r ? "bg-blue-700 text-white border-blue-700" : (darkMode ? "border-gray-600 text-gray-400 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-300")}`}>
                {r}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={`rounded-2xl border p-10 text-center text-gray-400 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className={`rounded-2xl border p-10 text-center text-gray-400 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>No allotments found.</div>
        ) : (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200"}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Student Name</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Roll No.</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Department</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sem</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Hall</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Seat</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email Sent</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Hall Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a, i) => (
                    <tr key={a._id} className={darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50"}>
                      <td className={`px-4 py-3 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{i + 1}</td>
                      <td className={`px-4 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{a.studentId?.name}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{a.studentId?.rollNo}</td>
                      <td className={`px-4 py-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{a.studentId?.department}</td>
                      <td className="px-4 py-3">{a.studentId?.semester}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">{a.roomId?.roomNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded font-mono">{a.seatNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        {a.emailSent
                          ? <span className="text-green-600 text-xs font-medium">✓ Sent</span>
                          : <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Pending</span>}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/pdf/hall-ticket/${a.studentId?._id}/${examId}?token=${localStorage.getItem("token")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          📄 Download
                        </a>
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
