import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaShieldAlt, FaNewspaper, FaBook, FaUserFriends, FaSignOutAlt, FaComments } from 'react-icons/fa';

const AdminLayout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Manage Teams', path: '/admin/manage-teams', icon: <FaShieldAlt /> },
    { name: 'Manage Players', path: '/admin/manage-players', icon: <FaUserFriends /> },
    { name: 'Manage News', path: '/admin/manage-news', icon: <FaNewspaper /> },
    { name: 'Manage Metas', path: '/admin/manage-metas', icon: <FaBook /> },
    { name: 'Manage Comments', path: '/admin/manage-comments', icon: <FaComments /> },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-accent/80 text-white shadow-lg'
        : 'text-text-secondary hover:bg-surface hover:text-text-main'
    }`;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-surface/30 backdrop-blur-xl border-r border-white/10 flex flex-col p-4">
        <div className="text-center py-4 mb-4">
          <Link to="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity">
            TAE-ESPORT
          </Link>
          <p className="text-xs text-text-secondary">ADMIN PANEL</p>
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={navLinkClass} end={item.path === '/admin'}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;