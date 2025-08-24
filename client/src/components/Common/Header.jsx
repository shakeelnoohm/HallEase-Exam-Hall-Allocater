import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">Hallease</h1>
      <nav>
        <Link to="/" className="px-3">Home</Link>
        <Link to="/admin/login" className="px-3">Admin</Link>
        <Link to="/student/login" className="px-3">Student</Link>
      </nav>
    </header>
  );
}

export default Header;
