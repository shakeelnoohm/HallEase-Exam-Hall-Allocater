import React, { useState } from "react";
import axios from "axios";

function AddRoom() {
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomName || !capacity) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/rooms/add", {
        roomName,
        capacity: Number(capacity),
      });

      setMessage(response.data.message || "Room added successfully!");
      setRoomName("");
      setCapacity("");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Add Room</h2>
        {message && (
          <p className="mb-4 text-center text-red-500 font-medium">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room capacity"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
