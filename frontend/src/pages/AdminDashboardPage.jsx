import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUserFriends, FaNewspaper, FaBook } from 'react-icons/fa';

const StatCard = ({ icon, title, value, color, to }) => (
  <Link to={to} className="glass-card p-6 flex items-center gap-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1">
    <div className={`text-4xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-text-secondary font-semibold uppercase">{title}</p>
      <p className="text-3xl font-bold text-text-main">{value}</p>
    </div>
  </Link>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ teams: 0, players: 0, news: 0, metas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, playersRes, newsRes, metasRes] = await Promise.all([
          apiClient.get('/teams?limit=1'), // limit=1 just to get the count from pagination
          apiClient.get('/players'),
          apiClient.get('/news'),
          apiClient.get('/metas'),
        ]);
        setStats({
          teams: teamsRes.data.pagination.totalItems,
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

  if (loading) return <p className="text-text-secondary">Loading dashboard...</p>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-text-main">Dashboard</h1>
        <p className="text-text-secondary mt-1">Overview of your website's content.</p>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FaShieldAlt />} title="Total Teams" value={stats.teams} color="text-blue-400" to="/admin/manage-teams" />
        <StatCard icon={<FaUserFriends />} title="Total Players" value={stats.players} color="text-green-400" to="/admin/manage-players" />
        <StatCard icon={<FaNewspaper />} title="News Articles" value={stats.news} color="text-yellow-400" to="/admin/manage-news" />
        <StatCard icon={<FaBook />} title="Meta Guides" value={stats.metas} color="text-purple-400" to="/admin/manage-metas" />
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-text-main">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/manage-teams/new" className="btn-outline">
            + Add New Team
          </Link>
          <Link to="/admin/manage-players/new" className="btn-outline">
            + Add New Player
          </Link>
          <Link to="/admin/manage-news/new" className="btn-outline">
            + Add New Article
          </Link>
           <Link to="/admin/manage-metas/new" className="btn-outline">
            + Add New Guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;