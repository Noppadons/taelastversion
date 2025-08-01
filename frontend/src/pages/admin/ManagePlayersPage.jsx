// frontend/src/pages/admin/ManagePlayersPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';

const ManagePlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // API ของ Player เรา include team ไว้อยู่แล้ว
        const response = await apiClient.get('/players');
        setPlayers(response.data);
      } catch (err) {
        console.error("Failed to fetch players", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await apiClient.delete(`/players/${playerId}`);
        setPlayers(players.filter(p => p.id !== playerId));
        alert('Player deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete the player.');
      }
    }
  };

  if (loading) return <p>Loading players...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Players</h1>
        <Link to="/admin/manage-players/new" className="btn btn-sm bg-secondary text-white">
          + Add New Player
        </Link>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="text-white">
              <th>ID</th>
              <th>Photo</th>
              <th>Nickname</th>
              <th>Role</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id} className="hover">
                <td>{player.id}</td>
                <td><img src={player.imageUrl || 'https://via.placeholder.com/40'} alt={player.nickname} className="w-10 h-10 object-cover rounded-full bg-black"/></td>
                <td>{player.nickname}</td>
                <td>{player.role || 'N/A'}</td>
                <td>{player.team?.name || 'No Team'}</td>
                <td className="space-x-2">
                  <Link to={`/admin/manage-players/edit/${player.id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                  <button onClick={() => handleDelete(player.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlayersPage;