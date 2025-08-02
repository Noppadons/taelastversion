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
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-surface">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="card-title text-2xl text-text-main justify-center mb-4">Admin Login</h1>
          <div className="form-control">
            <label className="label"><span className="label-text text-text-secondary">Username</span></label>
            <input type="text" placeholder="username" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-text-secondary">Password</span></label>
            <input type="password" placeholder="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="form-control mt-6">
            <button type="submit" className="btn-primary w-full">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;