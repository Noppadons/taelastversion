import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave } from 'react-icons/fa';

const TeamFormPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    gameId: '',
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await apiClient.get('/games');
        setGames(response.data);
      } catch (err) {
        console.error("Failed to fetch games", err);
      }
    };
    fetchGames();
    if (isEditMode) {
      const fetchTeamData = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(`/teams/${id}`);
          setTeamData({
            name: response.data.name,
            description: response.data.description || '',
            logoUrl: response.data.logoUrl || '',
            gameId: response.data.gameId,
          });
        } catch (err) {
          setError('Failed to fetch team data.');
        } finally {
          setLoading(false);
        }
      };
      fetchTeamData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!teamData.gameId) {
      setError('Please select a game.');
      setLoading(false);
      return;
    }
    const payload = { ...teamData, gameId: parseInt(teamData.gameId) };
    try {
      if (isEditMode) {
        await apiClient.put(`/teams/${id}`, payload);
      } else {
        await apiClient.post('/teams', payload);
      }
      alert(`Team ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-teams');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) return <p>Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Team: ${teamData.name}` : 'Create New Team'}</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Team Name</label>
              <input type="text" id="name" name="name" value={teamData.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-text-secondary mb-1">Game</label>
              <select id="gameId" name="gameId" value={teamData.gameId} onChange={handleChange} className="select-field" required>
                <option value="" disabled>Select a game</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea id="description" name="description" value={teamData.description} onChange={handleChange} className="textarea-field" rows="6"></textarea>
            </div>
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-text-secondary mb-1">Logo URL</label>
            <input type="text" id="logoUrl" name="logoUrl" value={teamData.logoUrl} onChange={handleChange} className="input-field mb-2" />
            <div className="bg-background rounded-lg p-4 h-48 flex items-center justify-center">
              {teamData.logoUrl ? (
                <img src={teamData.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain"/>
              ) : (
                <p className="text-text-secondary text-sm">Image Preview</p>
              )}
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}

        <div className="mt-8 pt-6 border-t border-gray-700 flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : (isEditMode ? 'Update Team' : 'Create Team')}
          </button>
          <Link to="/admin/manage-teams" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default TeamFormPage;