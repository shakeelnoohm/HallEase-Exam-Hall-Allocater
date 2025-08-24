import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";

import AdminDashboard from "./components/Admin/AdminDashboard";
import StudentDashboard from "./components/Student/StudentDashboard";

import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<h2 className="text-center mt-10">Welcome to Hallease</h2>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
