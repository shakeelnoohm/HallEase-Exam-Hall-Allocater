import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [form, setForm] = useState({ rollNo: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/student/login', form);
      localStorage.setItem('token', data.token);
      navigate('/student/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Roll No"
          value={form.rollNo}
          onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default StudentLogin;
