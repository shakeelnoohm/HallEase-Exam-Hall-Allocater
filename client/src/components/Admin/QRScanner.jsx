import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "../Common/AdminLayout";
import API from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function QRScanner() {
  const { darkMode } = useTheme();
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("present");
  const [marked, setMarked] = useState(false);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    setScanning(true);
    setResult(null);
    setError(null);
    setMarked(false);

    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const result = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          handleQRCode(result.getText());
          stopScanning();
        }
      });
    } catch (err) {
      setError("Could not access camera. Please ensure you have granted camera permissions.");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setScanning(false);
  };

  const handleQRCode = async (token) => {
    try {
      const res = await API.post("/pdf/verify-qr", { token });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid QR code");
    }
  };

  const markAttendance = async () => {
    if (!result) return;
    try {
      await API.post("/invigilator/attendance", {
        studentId: result.student.id,
        examId: result.exam._id,
        status
      });
      setMarked(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error marking attendance");
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout title="QR Code Scanner">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Scanner */}
        <div className={`rounded-2xl border p-6 shadow-sm text-center ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          {!scanning ? (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Scan Student QR Code</h3>
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Click below to start scanning student hall tickets</p>
              <button
                onClick={startScanning}
                className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
              >
                Start Camera
              </button>
            </>
          ) : (
            <>
              <div className="relative max-w-sm mx-auto">
                <video ref={videoRef} className="w-full rounded-xl" style={{ maxHeight: "400px" }} />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-400 rounded-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500"></div>
                  </div>
                </div>
              </div>
              <button
                onClick={stopScanning}
                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
              >
                Stop Scanning
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${result.valid ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`font-semibold ${result.valid ? (darkMode ? "text-green-400" : "text-green-700") : (darkMode ? "text-red-400" : "text-red-700")}`}>
                {result.valid ? "✓ Valid Hall Ticket" : "✗ Invalid Ticket"}
              </span>
            </div>

            {result.valid && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Student</p>
                    <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{result.student.name}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{result.student.rollNo}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Exam</p>
                    <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{result.exam.title}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{formatDate(result.exam.examDate)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl mb-4 text-center ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-600"}`}>HALL</p>
                      <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-blue-800"}`}>{result.allotment.roomNo}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-600"}`}>SEAT</p>
                      <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-blue-800"}`}>{result.allotment.seatNo}</p>
                    </div>
                  </div>
                </div>

                {!marked ? (
                  <>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setStatus("present")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${status === "present" ? "bg-green-600 text-white" : (darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setStatus("absent")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${status === "absent" ? "bg-red-600 text-white" : (darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => setStatus("late")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${status === "late" ? "bg-yellow-600 text-white" : (darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                      >
                        Late
                      </button>
                    </div>
                    <button
                      onClick={markAttendance}
                      className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
                    >
                      Mark Attendance
                    </button>
                  </>
                ) : (
                  <div className="bg-green-100 text-green-700 rounded-xl p-3 text-center font-medium">
                    ✓ Attendance marked as {status}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
