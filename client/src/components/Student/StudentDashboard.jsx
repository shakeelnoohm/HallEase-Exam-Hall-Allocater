import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [allotment, setAllotment] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Assuming token is stored in localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Please login to view dashboard.");
          return;
        }

        // Get student details
        const studentRes = await axios.get("/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(studentRes.data);

        // Get allotment details
        const allotmentRes = await axios.get(
          `/api/allotments/student/${studentRes.data._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllotment(allotmentRes.data);
      } catch (error) {
        console.error(error);
        setMessage(
          error.response?.data?.message || "Failed to fetch dashboard data."
        );
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    window.location.href = "/student/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {student && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Student Details</h2>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll Number:</strong> {student.rollNumber}</p>
            <p><strong>Class:</strong> {student.className}</p>
          </div>
        )}

        {allotment ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Allotment Details</h2>
            <p><strong>Room Name:</strong> {allotment.room.roomName}</p>
            <p><strong>Capacity:</strong> {allotment.room.capacity}</p>
          </div>
        ) : (
          <p className="text-gray-600">No allotment assigned yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
