import React, { useState, useEffect } from "react";
import axios from "axios";

function Allotment() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [message, setMessage] = useState("");

  // Fetch students and rooms from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get("/api/students");
        const roomRes = await axios.get("/api/rooms");
        setStudents(studentRes.data);
        setRooms(roomRes.data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to fetch students or rooms");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedRoom) {
      setMessage("Please select both student and room.");
      return;
    }

    try {
      const response = await axios.post("/api/allotments/add", {
        studentId: selectedStudent,
        roomId: selectedRoom,
      });

      setMessage(response.data.message || "Allotment successful!");
      setSelectedStudent("");
      setSelectedRoom("");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Allot Student to Room</h2>
        {message && (
          <p className="mb-4 text-center text-red-500 font-medium">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomName} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Allot
          </button>
        </form>
      </div>
    </div>
  );
}

export default Allotment;
