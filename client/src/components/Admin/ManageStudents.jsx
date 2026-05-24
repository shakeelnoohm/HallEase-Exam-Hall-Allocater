import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";

const DEPTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "Commerce", "Arts"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const emptyForm = { name: "", rollNo: "", email: "", password: "", department: "", semester: "", year: "" };

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

        {/* Filters + Add button */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Semesters</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setMsg(null); }}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "+ Add Student"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-base mb-4">New Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Arjun Kumar"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Roll Number</label>
                <input name="rollNo" value={form.rollNo} onChange={handleChange} required placeholder="e.g. CS2301"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="student@college.edu"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password (for login)</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters"
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                <select name="year" value={form.year} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Students ({students.length})</span>
          </div>
          {students.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll No.</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sem</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-5 py-3 text-gray-600 font-mono text-xs">{s.rollNo}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{s.email}</td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{s.department}</td>
                      <td className="px-5 py-3 text-gray-600">{s.semester}</td>
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
