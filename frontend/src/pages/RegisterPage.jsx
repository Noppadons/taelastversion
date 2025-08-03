// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setIsSubmitting(true);
    try {
        await apiClient.post('/auth/register', { username, email, password });
        navigate('/check-email'); // <-- เปลี่ยนให้ไปหน้า Check Email
    } catch (err) {
        setError(err.response?.data?.error || 'Registration failed.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2022/04/24/17/57/e-sports-7154316_1280.jpg')` }}>
      <div className="absolute inset-0 bg-background opacity-50 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 space-y-4">
          <div className="text-center">
              <Link to="/" className="text-3xl font-bold text-accent hover:opacity-80 transition-opacity">TAE-ESPORT</Link>
              <p className="text-text-secondary mt-2">Create a Fan Account</p>
          </div>
          <div className="form-control">
              <label className="label"><span className="label-text text-text-secondary">Username</span></label>
              <input type="text" placeholder="Choose a username" className="input-field bg-black/20" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-control">
              <label className="label"><span className="label-text text-text-secondary">Email</span></label>
              <input type="email" placeholder="Your email address" className="input-field bg-black/20" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-control">
              <label className="label"><span className="label-text text-text-secondary">Password</span></label>
              <input type="password" placeholder="6+ characters" className="input-field bg-black/20" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="form-control pt-4">
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
          </div>
          <div className="text-center text-sm">
              <span className="text-text-secondary">Already have an account? </span>
              <Link to="/login" className="text-accent hover:underline">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;