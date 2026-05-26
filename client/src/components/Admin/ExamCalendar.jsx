import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function ExamCalendar() {
  const { darkMode } = useTheme();
  const [exams, setExams] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await API.get("/exam");
      setExams(res.data);
    } catch {}
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getExamsForDate = (day) => {
    if (!day) return [];
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return exams.filter(e => new Date(e.examDate).toDateString() === dateStr);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <AdminLayout title="Exam Calendar">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-900" : "bg-white"} shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
            >
              ←
            </button>
            <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
            >
              →
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Today
            </button>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          {/* Weekday Headers */}
          <div className={`grid grid-cols-7 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            {weekDays.map(day => (
              <div key={day} className={`p-3 text-center text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayExams = getExamsForDate(day);
              const isToday = day && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b ${darkMode ? "border-gray-700" : "border-gray-100"} ${
                    day ? (darkMode ? "bg-gray-800/50" : "bg-white") : (darkMode ? "bg-gray-900/50" : "bg-gray-50")
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : (darkMode ? "text-gray-300" : "text-gray-700")}`}>
                        {day}
                        {isToday && <span className="ml-1 text-xs bg-blue-100 px-1 rounded">Today</span>}
                      </div>
                      <div className="space-y-1">
                        {dayExams.map(exam => (
                          <button
                            key={exam._id}
                            onClick={() => setSelectedExam(exam)}
                            className={`w-full text-left text-xs p-1.5 rounded truncate transition ${
                              exam.examType === "university" 
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200" 
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            {exam.startTime} {exam.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam Summary */}
        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-900" : "bg-white"} shadow-sm`}>
          <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
            This Month: {exams.filter(e => new Date(e.examDate).getMonth() === currentDate.getMonth()).length} Exams
          </h3>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-100"></span>
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>University Exams</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-100"></span>
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Internal Exams</span>
            </span>
          </div>
        </div>
      </div>

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{selectedExam.title}</h3>
              <button onClick={() => setSelectedExam(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                <span className="font-medium">Subject:</span> {selectedExam.subject}
              </p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                <span className="font-medium">Department:</span> {selectedExam.department}
              </p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                <span className="font-medium">Date:</span> {new Date(selectedExam.examDate).toLocaleDateString()}
              </p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                <span className="font-medium">Time:</span> {selectedExam.startTime} - {selectedExam.endTime}
              </p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                selectedExam.examType === "university" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
              }`}>
                {selectedExam.examType === "university" ? "University Exam" : "Internal Exam"}
              </span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
