import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    window.location.assign('/');
    logout();
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
    <nav className="bg-surface text-text-secondary sticky top-0 z-40 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity">
          TAE-ESPORT
        </Link>
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link to={link.path} className="text-lg hover:text-accent transition-colors">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="btn-outline !py-1 !px-3 text-sm">Admin Panel</Link>
              <button onClick={handleLogout} className="btn-ghost !py-1 !px-3 text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-outline !py-1 !px-3 text-sm">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;