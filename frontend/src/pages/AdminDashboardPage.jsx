// frontend/src/pages/AdminDashboardPage.jsx (ฉบับแปลงโฉม)

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUserFriends, FaNewspaper, FaBook } from 'react-icons/fa';

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center gap-6">
    <div className={`text-4xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-text-secondary font-semibold uppercase">{title}</p>
      <p className="text-3xl font-bold text-text-main">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ teams: 0, players: 0, news: 0, metas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, playersRes, newsRes, metasRes] = await Promise.all([
          apiClient.get('/teams'),
          apiClient.get('/players'),
          apiClient.get('/news'),
          apiClient.get('/metas'),
        ]);
        setStats({
          teams: teamsRes.data.length,
          players: playersRes.data.length,
          news: newsRes.data.length,
          metas: metasRes.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-text-secondary">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-text-main">Dashboard</h1>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<FaShieldAlt />} title="Total Teams" value={stats.teams} color="text-blue-400" />
        <StatCard icon={<FaUserFriends />} title="Total Players" value={stats.players} color="text-green-400" />
        <StatCard icon={<FaNewspaper />} title="News Articles" value={stats.news} color="text-yellow-400" />
        <StatCard icon={<FaBook />} title="Meta Guides" value={stats.metas} color="text-purple-400" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-text-main">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/manage-teams/new" className="btn bg-surface hover:bg-gray-700 text-text-main">
            + Add New Team
          </Link>
          <Link to="/admin/manage-players/new" className="btn bg-surface hover:bg-gray-700 text-text-main">
            + Add New Player
          </Link>
          <Link to="/admin/manage-news/new" className="btn bg-surface hover:bg-gray-700 text-text-main">
            + Add New Article
          </Link>
           <Link to="/admin/manage-metas/new" className="btn bg-surface hover:bg-gray-700 text-text-main">
            + Add New Guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;