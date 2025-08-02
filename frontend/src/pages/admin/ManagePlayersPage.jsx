import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const PlayerManagementCard = ({ player, onDelete }) => {
  return (
    <div className="bg-surface rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:shadow-accent/40 hover:-translate-y-1">
      <div className="h-40 bg-background rounded-t-lg flex items-center justify-center p-2">
        <img src={player.imageUrl || 'https://via.placeholder.com/150'} alt={player.nickname} className="w-28 h-28 object-cover rounded-full border-4 border-surface" />
      </div>
      <div className="p-4 flex-grow text-center">
        <h3 className="font-bold text-lg text-text-main truncate">{player.nickname}</h3>
        <p className="text-sm text-accent font-semibold">{player.role || 'N/A'}</p>
        <p className="text-xs text-text-secondary mt-1">{player.team?.name || 'No Team'}</p>
      </div>
      <div className="p-4 bg-background/50 rounded-b-lg border-t border-surface flex justify-between items-center">
        <p className="text-xs text-text-secondary font-mono">ID: {player.id}</p>
        <div className="space-x-2">
          <Link to={`/admin/manage-players/edit/${player.id}`} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-400 hover:text-white" title="Edit">
            <FaEdit size={14}/>
          </Link>
          <button onClick={() => onDelete(player.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
            <FaTrash size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagePlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
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

  if (loading) return <p className="text-text-secondary">Loading players...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Manage Players</h1>
          <p className="text-text-secondary mt-1">Manage all players in your organization.</p>
        </div>
        <Link to="/admin/manage-players/new" className="btn-primary">
          <FaPlus className="mr-2" /> Add New Player
        </Link>
      </div>
      <div className="bg-surface p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search players..." className="input-field pl-10" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>
      {players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {players.map(player => (
            <PlayerManagementCard key={player.id} player={player} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-surface rounded-lg p-12">
          <h3 className="text-2xl font-bold text-text-main">No Players Found</h3>
          <p className="text-text-secondary mt-2">Click "Add New Player" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManagePlayersPage;