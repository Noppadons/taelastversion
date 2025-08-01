// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // เรายังคงใช้ navigate สำหรับส่วนอื่นได้ แต่ไม่ใช่ตอน logout

  const handleLogout = () => {
    logout(); // สั่งให้ออกจากระบบ (ลบ Token)
    window.location.assign('/'); // บังคับให้โหลดหน้า Home ใหม่ทั้งหมด
  };
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Teams', path: '/teams' },
    { title: 'Players', path: '/players' },
    { title: 'Meta', path: '/meta' },
    { title: 'News', path: '/news' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-primary text-base-content sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-secondary hover:text-white transition-colors">
          TAE-ESPORT
        </Link>
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link to={link.path} className="text-lg hover:text-secondary transition-colors">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="btn btn-sm btn-outline btn-secondary">Admin Panel</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline btn-secondary">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;