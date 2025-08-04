import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // We use window.location.assign to ensure a full refresh and state reset
    window.location.assign('/'); 
  };
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Teams', path: '/teams' },
    { title: 'Players', path: '/players' },
    { title: 'Meta', path: '/meta' },
    { title: 'News', path: '/news' },
    { title: 'Contact', path: '/contact' },
  ];

  const UserAvatar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-surface flex items-center justify-center overflow-hidden flex-shrink-0`}>
        <img 
            src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.username.substring(0,2)}&background=111827&color=22d3ee`} 
            alt="User Avatar"
            className="w-full h-full object-cover"
        />
    </div>
  );

  return (
    <nav className="bg-surface text-text-secondary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity z-50">
          TAE-ESPORT
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.title}>
              <NavLink to={link.path} className={({isActive}) => `text-lg transition-colors ${isActive ? 'text-accent' : 'hover:text-accent'}`}>
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to={`/users/${user?.username}`} className="flex items-center gap-3 text-text-main hover:text-accent transition-colors">
                <UserAvatar />
                <span className="font-semibold">{user?.username}</span>
              </Link>
              {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="btn-outline !py-1 !px-3 text-sm">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn-ghost !py-1 !px-3 text-sm">Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost !py-1 !px-3 text-sm">Login</Link>
              <Link to="/register" className="btn-outline !py-1 !px-3 text-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open menu">
            {isMobileMenuOpen ? <HiX size={28} className="text-text-main" /> : <HiMenu size={28} className="text-text-main" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-0 left-0 w-full h-screen bg-background pt-24 pb-8 flex flex-col"
          >
            <ul className="flex flex-col items-center gap-y-6">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <NavLink to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `text-2xl transition-colors ${isActive ? 'text-accent' : 'hover:text-accent'}`}>
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6 border-t border-surface flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={`/users/${user?.username}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-text-main text-xl">
                  <UserAvatar isMobile={true} />
                  <span className="font-semibold">{user?.username}</span>
                </Link>
                {user?.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="btn-outline w-48">Admin Panel</Link>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-ghost w-48">Logout</button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-ghost w-48">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-outline w-48">Register</Link>
              </div>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
