import React, { useState } from "react";
import api from "../../utils/api";

function AddClass() {
  const [formData, setFormData] = useState({
    className: "",
    department: "",
    semester: "",
    subjects: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/classes", {
        ...formData,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
      });
      alert("Class added successfully!");
      setFormData({ className: "", department: "", semester: "", subjects: "" });
    } catch (error) {
      alert("Error adding class");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            placeholder="Class Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="Subjects (comma separated)"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClass;
