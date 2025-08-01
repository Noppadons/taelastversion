// frontend/src/pages/admin/PlayerFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';

const PlayerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nickname: '',
    realName: '',
    imageUrl: '',
    role: '',
    teamId: '',
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // ดึงรายชื่อทีมทั้งหมดสำหรับ dropdown
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get('/teams');
        setTeams(response.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchPlayer = async () => {
        try {
          const response = await apiClient.get(`/players/${id}`);
          setFormData({
            nickname: response.data.nickname,
            realName: response.data.realName || '',
            imageUrl: response.data.imageUrl || '',
            role: response.data.role || '',
            teamId: response.data.teamId,
          });
        } catch (err) {
          setError('Failed to fetch player data.');
        }
      };
      fetchPlayer();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId) {
      setError('Please select a team.');
      return;
    }
    setLoading(true);
    const payload = { ...formData, teamId: parseInt(formData.teamId) };

    try {
      if (isEditMode) {
        await apiClient.put(`/players/${id}`, payload);
      } else {
        await apiClient.post('/players', payload);
      }
      alert(`Player ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-players');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Player' : 'Create New Player'}</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl">
        {/* Nickname */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-base-content mb-2">Nickname</label>
          <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full input bg-gray-700" required />
        </div>
        {/* Team Selection */}
        <div className="mb-4">
          <label htmlFor="teamId" className="block text-base-content mb-2">Team</label>
          <select id="teamId" name="teamId" value={formData.teamId} onChange={handleChange} className="w-full select bg-gray-700" required>
            <option value="" disabled>Select a team</option>
            {teams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}
          </select>
        </div>
         {/* Role */}
         <div className="mb-4">
          <label htmlFor="role" className="block text-base-content mb-2">Role</label>
          <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>
        {/* Real Name */}
        <div className="mb-4">
          <label htmlFor="realName" className="block text-base-content mb-2">Real Name (Optional)</label>
          <input type="text" id="realName" name="realName" value={formData.realName} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>
        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-base-content mb-2">Image URL (Optional)</label>
          <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex items-center gap-4">
          <button type="submit" className="btn bg-secondary text-white" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Player' : 'Create Player')}
          </button>
          <Link to="/admin/manage-players" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default PlayerFormPage;