import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function ChatSupport() {
  const { darkMode } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState({ status: "OPEN", priority: "" });

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      const res = await API.get("/chat/tickets", { params });
      setTickets(res.data);
    } catch {}
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedTicket) return;
    try {
      await API.post(`/chat/${selectedTicket._id}/message`, { content: message });
      setMessage("");
      fetchTickets();
    } catch {}
  };

  const assignToMe = async (ticketId) => {
    try {
      await API.post(`/chat/${ticketId}/assign`, { adminId: JSON.parse(localStorage.getItem("admin"))._id });
      fetchTickets();
    } catch {}
  };

  const resolveTicket = async (ticketId) => {
    try {
      await API.post(`/chat/${ticketId}/resolve`);
      fetchTickets();
      setSelectedTicket(null);
    } catch {}
  };

  return (
    <AdminLayout title="Support Tickets">
      <div className="h-[calc(100vh-140px)] flex gap-4">
        {/* Ticket List */}
        <div className={`w-80 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex gap-2 mb-3">
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className={`flex-1 border rounded-lg px-2 py-1 text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}
              >
                <option value="">All</option>
                <option value="OPEN">Open</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className={`flex-1 border rounded-lg px-2 py-1 text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}
              >
                <option value="">Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tickets.length} tickets</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((ticket) => (
              <button
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full p-3 text-left border-b transition ${
                  selectedTicket?._id === ticket._id 
                    ? (darkMode ? "bg-blue-900/30 border-blue-500" : "bg-blue-50 border-blue-300")
                    : (darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-100 hover:bg-gray-50")
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {ticket.participants[0]?.name || "Unknown"}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    ticket.priority === "HIGH" ? "bg-red-100 text-red-700" :
                    ticket.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className={`text-xs mt-1 truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {ticket.messages[ticket.messages.length - 1]?.content || "No messages"}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {new Date(ticket.lastActivityAt).toLocaleTimeString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          {selectedTicket ? (
            <>
              <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {selectedTicket.participants[0]?.name || "Unknown"}
                    </h3>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {selectedTicket.relatedTo?.entity || "General Support"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!selectedTicket.assignedTo && (
                      <button
                        onClick={() => assignToMe(selectedTicket._id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
                      >
                        Assign to Me
                      </button>
                    )}
                    <button
                      onClick={() => resolveTicket(selectedTicket._id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedTicket.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.sender.userType === "Admin"
                        ? "bg-blue-600 text-white ml-auto"
                        : darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender.userType === "Admin" ? "text-blue-200" : "text-gray-500"}`}>
                      {msg.sender.name} • {new Date(msg.sentAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a ticket to view conversation
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
