import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const DEPTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "Commerce", "Arts"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const emptyForm = {
  name: "", rollNo: "", email: "", password: "", department: "", semester: "", year: "",
  wheelchair: false, extraTime: false, scribe: false, frontRow: false, visualAid: false, hearingAid: false
};

export default function ManageStudents() {
  const { darkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);

  const fetchStudents = React.useCallback(async () => {
    try {
      const params = {};
      if (filterDept) params.department = filterDept;
      if (filterSem) params.semester = filterSem;
      const res = await API.get("/student", { params });
      setStudents(res.data);
    } catch { }
  }, [filterDept, filterSem]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await API.post("/student/add", { ...form, semester: Number(form.semester), year: Number(form.year) || 1 });
      setMsg({ type: "success", text: `Student "${form.name}" added successfully!` });
      setForm(emptyForm);
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error adding student" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"?`)) return;
    try {
      await API.delete(`/student/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting student");
    }
  };

  return (
    <AdminLayout title="Manage Students">
      <div className="space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        {/* CSV Upload + Filters + Add button */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
              <option value="">All Departments</option>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
              <option value="">All Semesters</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <a href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/csv/template`}
              className={`border px-4 py-2 rounded-lg text-sm font-medium transition ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
              📥 CSV Template
            </a>
            <label className={`border px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
              📤 Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setCsvLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await API.post("/csv/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
                  setMsg({ type: "success", text: `Imported ${res.data.inserted} students. ${res.data.duplicates > 0 ? `${res.data.duplicates} duplicates skipped.` : ""}` });
                  fetchStudents();
                } catch (err) {
                  setMsg({ type: "error", text: err.response?.data?.message || "Error uploading CSV" });
                } finally {
                  setCsvLoading(false);
                  e.target.value = "";
                }
              }} />
            </label>
            <button
              onClick={() => { setShowForm(!showForm); setMsg(null); }}
              className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
            >
              {showForm ? "Cancel" : "+ Add Student"}
            </button>
          </div>
        </div>

        {csvLoading && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
            Uploading CSV...
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-semibold text-base mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>New Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Arjun Kumar"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Roll Number</label>
                <input name="rollNo" value={form.rollNo} onChange={handleChange} required placeholder="e.g. CS2301"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="student@college.edu"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Password (for login)</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Department</label>
                <select name="department" value={form.department} onChange={handleChange} required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
                  <option value="">Select department</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Semester</label>
                <select name="semester" value={form.semester} onChange={handleChange} required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
                  <option value="">Select semester</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Year</label>
                <select name="year" value={form.year} onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}>
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Special Accommodations (if any)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "wheelchair", label: "♿ Wheelchair" },
                  { name: "extraTime", label: "⏱️ Extra Time" },
                  { name: "scribe", label: "✍️ Scribe" },
                  { name: "frontRow", label: "🪑 Front Row" },
                  { name: "visualAid", label: "👁️ Visual Aid" },
                  { name: "hearingAid", label: "🔊 Hearing Aid" }
                ].map(acc => (
                  <label key={acc.name} className={`flex items-center gap-2 text-sm cursor-pointer ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <input type="checkbox" name={acc.name} checked={form[acc.name]} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    {acc.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </form>
        )}

        {/* Students table */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`px-5 py-3 border-b flex items-center justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
            <span className={`text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Students ({students.length})</span>
          </div>
          {students.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={darkMode ? "border-b border-gray-700" : "border-b border-gray-200"}>
                  <tr>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Name</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Roll No.</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Department</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sem</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Accommodations</th>
                    <th className={`px-5 py-3 text-right text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s._id} className={darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-600"}>
                      <td className={`px-5 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{s.name}</td>
                      <td className={`px-5 py-3 font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{s.rollNo}</td>
                      <td className={`px-5 py-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.email}</td>
                      <td className={`px-5 py-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{s.department}</td>
                      <td className="px-5 py-3">{s.semester}</td>
                      <td className="px-5 py-3">
                        {s.accommodations && Object.entries(s.accommodations).filter(([,v]) => v).length > 0 && (
                          <span className="text-xs">
                            {s.accommodations.wheelchair && "♿ "}
                            {s.accommodations.extraTime && "⏱️ "}
                            {s.accommodations.scribe && "✍️ "}
                            {s.accommodations.frontRow && "🪑 "}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => handleDelete(s._id, s.name)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition">
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
