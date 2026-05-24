import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const [student] = useState(() => {
    try { return JSON.parse(localStorage.getItem("student")); } catch { return null; }
  });
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/student/login"); return; }

    const fetchData = async () => {
      try {
        const aRes = await API.get("/allotment/my");
        setAllotments(aRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/student/login");
        } else {
          setError(err.response?.data?.message || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    navigate("/student/login");
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">HallEase</span>
          </div>
          <button onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition font-medium">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profile card */}
        {student && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-700">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
              <p className="text-gray-500 text-sm">{student.department} · Semester {student.semester}</p>
              <p className="text-gray-400 text-xs mt-0.5 font-mono">Roll No: {student.rollNo}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Allotments */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Your Exam Hall Allotments</h2>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">Loading…</div>
          ) : allotments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <div className="text-4xl mb-3">🪑</div>
              <p className="text-gray-600 font-medium">No exam hall allotted yet</p>
              <p className="text-gray-400 text-sm mt-1">You'll receive an email once your seat is allocated.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allotments.map((a) => {
                const exam = a.examId;
                const room = a.roomId;
                return (
                  <div key={a._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${exam?.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {exam?.examType === "university" ? "University Exam" : "Internal Exam"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-base">{exam?.title}</h3>
                        <p className="text-gray-600 text-sm mt-0.5">{exam?.subject}</p>
                        <p className="text-gray-500 text-sm">{exam?.department} · Semester {exam?.semester}</p>
                        {exam?.examDate && (
                          <p className="text-gray-500 text-sm mt-1">
                            📅 {formatDate(exam.examDate)} · {exam.startTime} – {exam.endTime}
                          </p>
                        )}
                      </div>

                      {/* Seat highlight box */}
                      <div className="bg-blue-700 text-white rounded-2xl p-5 text-center min-w-[130px]">
                        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-1">Hall</p>
                        <p className="text-xl font-extrabold">{room?.roomNo}</p>
                        <div className="mt-3 border-t border-blue-600 pt-3">
                          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-1">Seat</p>
                          <p className="text-2xl font-extrabold">{a.seatNo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <span className={`text-xs ${a.emailSent ? "text-green-600" : "text-gray-400"}`}>
                        {a.emailSent ? "✓ Email notification sent" : "Email notification pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          HallEase · <Link to="/" className="hover:underline">Home</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentDashboard;
