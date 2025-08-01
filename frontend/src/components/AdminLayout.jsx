// frontend/src/components/AdminLayout.jsx

import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // เรายังคงใช้ navigate สำหรับส่วนอื่นได้ แต่ไม่ใช่ตอน logout

  const handleLogout = () => {
    logout(); // สั่งให้ออกจากระบบ (ลบ Token)
    window.location.assign('/'); // บังคับให้โหลดหน้า Home ใหม่ทั้งหมด
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-secondary mb-8">Admin Panel</h1>
        <nav className="flex-grow">
          <ul>
            <li><Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link></li>
            <li><Link to="/admin/manage-teams" className="block py-2 px-4 rounded hover:bg-gray-700">Manage Teams</Link></li>
            <li><Link to="/admin/manage-news" className="block py-2 px-4 rounded hover:bg-gray-700">Manage News</Link></li>
            <li><Link to="/admin/manage-metas" className="block py-2 px-4 rounded hover:bg-gray-700">Manage Metas</Link></li>
            <li><Link to="/admin/manage-players" className="block py-2 px-4 rounded hover:bg-gray-700">Manage Players</Link></li>
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          className="w-full mt-8 btn bg-red-600 hover:bg-red-700 text-white border-none"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;