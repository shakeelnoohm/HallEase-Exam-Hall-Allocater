import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";

import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageExams from "./components/Admin/ManageExams";
import ManageRooms from "./components/Admin/ManageRooms";
import ManageStudents from "./components/Admin/ManageStudents";
import AllocateHall from "./components/Admin/AllocateHall";
import ViewAllotmentsAdmin from "./components/Admin/ViewAllotmentsAdmin";

import StudentDashboard from "./components/Student/StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/exams" element={<ManageExams />} />
        <Route path="/admin/rooms" element={<ManageRooms />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/allocate" element={<AllocateHall />} />
        <Route path="/admin/allotments/:examId" element={<ViewAllotmentsAdmin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
