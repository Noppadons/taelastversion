// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login', { identifier, password });
      const userData = response.data;
      if (userData.token) {
        login(userData);
        if (userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2022/04/24/17/57/e-sports-7154316_1280.jpg')` }}>
      <div className="absolute inset-0 bg-background opacity-50 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 space-y-6">
          <div className="text-center">
              <Link to="/" className="text-3xl font-bold text-accent hover:opacity-80 transition-opacity">TAE-ESPORT</Link>
              <p className="text-text-secondary mt-2">Login to your Account</p>
          </div>
          <div className="form-control">
              <label className="label"><span className="label-text text-text-secondary">Email or Username</span></label>
              <input type="text" placeholder="your email or username" className="input-field bg-black/20" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>
          <div className="form-control">
              <label className="label"><span className="label-text text-text-secondary">Password</span></label>
              <input type="password" placeholder="password" className="input-field bg-black/20" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="form-control pt-4">
              <button type="submit" className="btn-primary w-full">Login</button>
          </div>
          <div className="text-center text-sm">
              <span className="text-text-secondary">Don't have an account? </span>
              <Link to="/register" className="text-accent hover:underline">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;