// frontend/src/pages/admin/ManageTeamsPage.jsx (ฉบับ Modern Card Layout)

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

// สร้าง Management Card Component แยกออกมาเพื่อความสะอาด
const TeamManagementCard = ({ team, onDelete }) => {
  return (
    <div className="bg-surface rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:shadow-accent/40 hover:-translate-y-1">
      {/* Card Header with Logo */}
      <div className="p-4 bg-background rounded-t-lg flex items-center justify-center h-40">
        <img src={team.logoUrl || 'https://via.placeholder.com/200x100?text=No+Logo'} alt={team.name} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Card Body */}
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-text-main truncate">{team.name}</h3>
        <p className="text-sm text-text-secondary">{team.game.name}</p>
      </div>

      {/* Card Footer with Actions */}
      <div className="p-4 bg-background/50 rounded-b-lg border-t border-surface flex justify-between items-center">
        <p className="text-xs text-text-secondary font-mono">ID: {team.id}</p>
        <div className="space-x-2">
          <Link to={`/admin/manage-teams/edit/${team.id}`} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-400 hover:text-white" title="Edit">
            <FaEdit size={14}/>
          </Link>
          <button onClick={() => onDelete(team.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
            <FaTrash size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};


const ManageTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/teams');
        setTeams(response.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await apiClient.delete(`/teams/${teamId}`);
        setTeams(teams.filter(team => team.id !== teamId));
        alert('Team deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete team.');
      }
    }
  };

  if (loading) return <p className="text-text-secondary">Loading teams...</p>;

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Manage Teams</h1>
          <p className="text-text-secondary mt-1">Add, edit, or delete your organization's teams.</p>
        </div>
        <Link to="/admin/manage-teams/new" className="btn-primary">
          <FaPlus className="mr-2" /> Add New Team
        </Link>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-surface p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search teams..." className="input-field pl-10" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>

      {/* 3. Data Grid (Redesigned from Table to Cards) */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {teams.map(team => (
            <TeamManagementCard key={team.id} team={team} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-surface rounded-lg p-12">
          <h3 className="text-2xl font-bold text-text-main">No Teams Found</h3>
          <p className="text-text-secondary mt-2">Click "Add New Team" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageTeamsPage;