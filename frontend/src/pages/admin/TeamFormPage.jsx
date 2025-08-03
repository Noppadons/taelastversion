import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave, FaUpload } from 'react-icons/fa';

const TeamFormPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [teamData, setTeamData] = useState({ name: '', description: '', logoUrl: '', gameId: '' });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchInitialData = async () => {
      try {
        const gamesRes = await apiClient.get('/games');
        setGames(gamesRes.data);

        if (isEditMode) {
          const teamRes = await apiClient.get(`/teams/${id}`);
          setTeamData(teamRes.data);
          if (teamRes.data.logoUrl) {
            setPreview(teamRes.data.logoUrl);
          }
        }
      } catch (err) {
        setError('Failed to fetch initial data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!teamData.gameId) {
      setError('Please select a game.');
      return;
    }
    setLoading(true);

    let finalLogoUrl = teamData.logoUrl;

    if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        try {
            const uploadRes = await apiClient.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            finalLogoUrl = uploadRes.data.imageUrl;
        } catch (err) {
            setError('Image upload failed. Please try again.');
            setLoading(false);
            setUploading(false);
            return;
        }
        setUploading(false);
    }

    const payload = { ...teamData, logoUrl: finalLogoUrl, gameId: parseInt(teamData.gameId) };

    try {
      if (isEditMode) {
        await apiClient.put(`/teams/${id}`, payload);
      } else {
        await apiClient.post('/teams', payload);
      }
      alert(`Team ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-teams');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while saving the team.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <p className="text-text-secondary p-8">Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Team: ${teamData.name}` : 'Create New Team'}</h1>
      <form onSubmit={handleSubmit} className="glass-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Team Name</label>
              <input type="text" id="name" name="name" value={teamData.name} onChange={handleChange} className="input-field bg-black/20" required />
            </div>
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-text-secondary mb-1">Game</label>
              <select id="gameId" name="gameId" value={teamData.gameId} onChange={handleChange} className="select-field bg-black/20" required>
                <option value="" disabled>Select a game</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea id="description" name="description" value={teamData.description} onChange={handleChange} className="textarea-field bg-black/20" rows="6"></textarea>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Team Logo</label>
            <div className="bg-black/20 rounded-lg p-4 h-48 flex items-center justify-center mb-2">
              {preview ? (
                <img src={preview} alt="Logo Preview" className="max-h-full max-w-full object-contain"/>
              ) : (
                <p className="text-text-secondary text-sm">Image Preview</p>
              )}
            </div>
            <label htmlFor="logoUpload" className="btn-outline w-full cursor-pointer !py-2 !px-3 text-sm">
                <FaUpload className="mr-2"/> <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
            </label>
            <input type="file" id="logoUpload" onChange={handleFileChange} className="hidden" accept="image/*"/>
            {uploading && <p className="text-accent text-sm mt-2 text-center animate-pulse">Uploading image...</p>}
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={loading || uploading}>
            <FaSave className="mr-2" />
            {loading || uploading ? 'Saving...' : (isEditMode ? 'Update Team' : 'Create Team')}
          </button>
          <Link to="/admin/manage-teams" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default TeamFormPage;