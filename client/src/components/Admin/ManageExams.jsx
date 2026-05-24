import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

const DEPTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "Commerce", "Arts"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const emptyForm = {
  title: "", examType: "internal", subject: "", department: "",
  semester: "", examDate: "", startTime: "", endTime: ""
};

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchExams = async () => {
    try {
      const res = await API.get("/exam");
      setExams(res.data);
    } catch { }
  };

  useEffect(() => { fetchExams(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await API.post("/exam", form);
      setMsg({ type: "success", text: "Exam created successfully!" });
      setForm(emptyForm);
      setShowForm(false);
      fetchExams();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error creating exam" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam? This will also remove all its allotments.")) return;
    try {
      await API.delete(`/exam/${id}`);
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting exam");
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout title="Manage Exams">
      <div className="space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">{exams.length} exam(s) found</p>
          <button
            onClick={() => { setShowForm(!showForm); setMsg(null); }}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "+ Add Exam"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-base mb-2">New Exam</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Exam Title</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Mid Semester Test 1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Exam Type</label>
                <select name="examType" value={form.examType} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="internal">Internal Examination</option>
                  <option value="university">University Examination</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="e.g. Data Structures"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select name="department" value={form.department} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select department</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
                <select name="semester" value={form.semester} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select semester</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Exam Date</label>
                <input type="date" name="examDate" value={form.examDate} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Creating..." : "Create Exam"}
              </button>
            </div>
          </form>
        )}

        {/* Exam list */}
        <div className="space-y-3">
          {exams.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
              No exams added yet. Click "+ Add Exam" to get started.
            </div>
          )}
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${exam.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {exam.examType === "university" ? "University" : "Internal"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{exam.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {exam.subject} · {exam.department} · Sem {exam.semester} · {formatDate(exam.examDate)} · {exam.startTime}–{exam.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {exam.allocated && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Allocated</span>
                )}
                <button onClick={() => handleDelete(exam._id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
