import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewAllotment() {
  const [allotments, setAllotments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllotments = async () => {
      try {
        const res = await axios.get("/api/allotments");
        setAllotments(res.data);
      } catch (error) {
        console.error(error);
        setMessage(
          error.response?.data?.message || "Failed to fetch allotments."
        );
      }
    };

    fetchAllotments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Allotment Details</h1>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {allotments.length === 0 ? (
          <p className="text-gray-600 text-center">No allotments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">Student Name</th>
                  <th className="px-4 py-2 border">Roll Number</th>
                  <th className="px-4 py-2 border">Class</th>
                  <th className="px-4 py-2 border">Room Name</th>
                  <th className="px-4 py-2 border">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {allotments.map((allot) => (
                  <tr key={allot._id} className="text-center">
                    <td className="px-4 py-2 border">{allot.student.name}</td>
                    <td className="px-4 py-2 border">{allot.student.rollNumber}</td>
                    <td className="px-4 py-2 border">{allot.student.className}</td>
                    <td className="px-4 py-2 border">{allot.room.roomName}</td>
                    <td className="px-4 py-2 border">{allot.room.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAllotment;
