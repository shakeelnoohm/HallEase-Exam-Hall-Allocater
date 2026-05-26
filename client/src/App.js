import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AnalyticsDashboard from "./components/Admin/AnalyticsDashboard";
import ExamCalendar from "./components/Admin/ExamCalendar";
import ManageExams from "./components/Admin/ManageExams";
import ManageRooms from "./components/Admin/ManageRooms";
import ManageStudents from "./components/Admin/ManageStudents";
import ManageInvigilators from "./components/Admin/ManageInvigilators";
import AllocateHall from "./components/Admin/AllocateHall";
import ViewAllotmentsAdmin from "./components/Admin/ViewAllotmentsAdmin";
import QRScanner from "./components/Admin/QRScanner";
import AuditLogs from "./components/Admin/AuditLogs";
import EmergencyBroadcast from "./components/Admin/EmergencyBroadcast";
import FeedbackManager from "./components/Admin/FeedbackManager";
import ChatSupport from "./components/Admin/ChatSupport";
import BackupManager from "./components/Admin/BackupManager";

import StudentDashboard from "./components/Student/StudentDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/calendar" element={<ExamCalendar />} />
          <Route path="/admin/exams" element={<ManageExams />} />
          <Route path="/admin/rooms" element={<ManageRooms />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/invigilators" element={<ManageInvigilators />} />
          <Route path="/admin/allocate" element={<AllocateHall />} />
          <Route path="/admin/allotments/:examId" element={<ViewAllotmentsAdmin />} />
          <Route path="/admin/qr-scanner" element={<QRScanner />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/emergency" element={<EmergencyBroadcast />} />
          <Route path="/admin/feedback" element={<FeedbackManager />} />
          <Route path="/admin/support" element={<ChatSupport />} />
          <Route path="/admin/backup" element={<BackupManager />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
