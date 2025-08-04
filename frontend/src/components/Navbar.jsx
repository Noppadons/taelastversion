import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };
  
  const navLinks = [ /* ... */ ];

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center overflow-hidden">
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
        
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.title}>
              <NavLink to={link.path} className={({isActive}) => `text-lg transition-colors ${isActive ? 'text-accent' : 'hover:text-accent'}`}>
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>

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

        <div className="md:hidden z-50">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX size={28} className="text-text-main" /> : <HiMenu size={28} className="text-text-main" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-surface shadow-lg"
          >
            <ul className="flex flex-col items-center gap-y-4 py-4">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <NavLink to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `text-xl transition-colors ${isActive ? 'text-accent' : 'hover:text-accent'}`}>
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="py-4 border-t border-background flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={`/users/${user?.username}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-text-main text-xl">
                  <UserAvatar />
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