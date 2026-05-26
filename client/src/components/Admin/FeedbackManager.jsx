import React, { useState, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

const RATING_LABELS = {
  hallCondition: "Hall Condition",
  seatingComfort: "Seating Comfort",
  temperature: "Temperature",
  lighting: "Lighting",
  overall: "Overall"
};

export default function FeedbackManager() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, feedbackRes] = await Promise.all([
        API.get("/feedback/stats"),
        API.get("/feedback")
      ]);
      setStats(statsRes.data);
      setFeedback(feedbackRes.data);
    } catch {}
    setLoading(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Feedback & Ratings">
      <div className="space-y-6">
        {/* Rating Stats */}
        {stats?.ratings && (
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Average Ratings</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(RATING_LABELS).map(([key, label]) => {
                const value = stats.ratings[`avg${key.charAt(0).toUpperCase() + key.slice(1)}`] || 0;
                return (
                  <div key={key} className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                    <div className="flex justify-center mb-1">{renderStars(Math.round(value))}</div>
                    <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{value.toFixed(1)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Issue Stats */}
        {stats?.issues && stats.issues.length > 0 && (
          <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Reported Issues</h3>
            <div className="flex flex-wrap gap-2">
              {stats.issues.map(issue => (
                <div key={issue._id} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {issue._id}: {issue.count}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <span className={`text-xs font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Recent Feedback ({feedback.length})
            </span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : feedback.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No feedback received yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {feedback.map((f) => (
                <div key={f._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {f.examId?.title || "Unknown Exam"}
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {f.isAnonymous ? "Anonymous" : f.studentId?.name} • {new Date(f.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(f.ratings?.overall || 0)}
                    </div>
                  </div>
                  {f.comments && (
                    <p className={`text-sm mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{f.comments}</p>
                  )}
                  {f.issues && f.issues.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {f.issues.map((issue, i) => (
                        <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          {issue.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
