// frontend/src/pages/LoginPage.jsx (โค้ดนี้ถูกต้องอยู่แล้ว แต่เพื่อความชัวร์ครับ)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { token } = response.data;
      
      if (token) {
        login(token);
        navigate('/admin'); // <-- คำสั่งให้เด้งไปที่หน้า AdminDashbord
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="bg-base-100 min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-gray-800">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="card-title text-2xl text-white justify-center mb-4">Admin Login</h1>
          {/* ... โค้ดส่วนของ form inputs ... */}
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content">Username</span></label>
            <input type="text" placeholder="username" className="input input-bordered bg-gray-700 text-white" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content">Password</span></label>
            <input type="password" placeholder="password" className="input input-bordered bg-gray-700 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="form-control mt-6">
            <button type="submit" className="btn bg-secondary text-white hover:bg-red-700">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;