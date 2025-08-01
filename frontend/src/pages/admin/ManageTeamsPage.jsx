// frontend/src/pages/admin/ManageTeamsPage.jsx (ฉบับสมบูรณ์)

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';

const ManageTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get('/teams');
        setTeams(response.data);
      } catch (err) {
        setError(err.message);
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

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Teams</h1>
        {/* แก้ไขปุ่ม Add New Team ให้เป็น Link */}
        <Link to="/admin/manage-teams/new" className="btn btn-sm bg-secondary text-white hover:bg-red-700">
          + Add New Team
        </Link>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="text-white">
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Game</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id} className="hover">
                <td>{team.id}</td>
                <td><img src={team.logoUrl || 'https://via.placeholder.com/40'} alt={team.name} className="w-10 h-10 object-contain rounded-md bg-black" /></td>
                <td>{team.name}</td>
                <td>{team.game.name}</td>
                <td className="space-x-2">
                  {/* แก้ไขปุ่ม Edit ให้เป็น Link */}
                  <Link to={`/admin/manage-teams/edit/${team.id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                  <button onClick={() => handleDelete(team.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeamsPage;