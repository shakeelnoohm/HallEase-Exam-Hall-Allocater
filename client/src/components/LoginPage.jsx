import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ rollNo: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = isAdmin ? '/api/admin/login' : '/api/students/login';
      const payload = isAdmin
        ? { username: formData.username, password: formData.password }
        : { rollNo: formData.rollNo, password: formData.password };

      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>{isAdmin ? 'Admin Login' : 'Student Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isAdmin ? (
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        ) : (
          <input
            type="text"
            placeholder="Roll No"
            value={formData.rollNo}
            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Switch to {isAdmin ? 'Student' : 'Admin'} Login
      </button>
    </div>
  );
}
