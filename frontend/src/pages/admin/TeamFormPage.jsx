// frontend/src/pages/admin/TeamFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';

const TeamFormPage = () => {
  // ดึง id จาก URL, ถ้าเป็นหน้า "new" จะไม่มี id
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    gameId: '',
  });
  const [games, setGames] = useState([]); // State สำหรับเก็บรายชื่อเกมทั้งหมด (สำหรับ dropdown)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. ดึงข้อมูลเกมทั้งหมดมาเพื่อสร้าง dropdown
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
  }, []);

  // 2. ถ้าเป็นโหมดแก้ไข (มี id), ให้ดึงข้อมูลของทีมนั้นๆ มาใส่ในฟอร์ม
  useEffect(() => {
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
    setTeamData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ตรวจสอบว่าเลือกเกมแล้วหรือยัง
    if (!teamData.gameId) {
      setError('Please select a game.');
      setLoading(false);
      return;
    }

    const payload = {
      ...teamData,
      gameId: parseInt(teamData.gameId)
    };

    try {
      if (isEditMode) {
        // โหมดแก้ไข: ใช้ method PUT
        await apiClient.put(`/teams/${id}`, payload);
      } else {
        // โหมดสร้างใหม่: ใช้ method POST
        await apiClient.post('/teams', payload);
      }
      alert(`Team ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-teams'); // กลับไปหน้าตาราง
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p>Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Team' : 'Create New Team'}</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl">
        {/* Team Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-base-content mb-2">Team Name</label>
          <input type="text" id="name" name="name" value={teamData.name} onChange={handleChange} className="w-full input bg-gray-700" required />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-base-content mb-2">Description</label>
          <textarea id="description" name="description" value={teamData.description} onChange={handleChange} className="w-full textarea bg-gray-700" rows="4"></textarea>
        </div>
        {/* Logo URL */}
        <div className="mb-4">
          <label htmlFor="logoUrl" className="block text-base-content mb-2">Logo URL</label>
          <input type="text" id="logoUrl" name="logoUrl" value={teamData.logoUrl} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>
        {/* Game Selection */}
        <div className="mb-6">
          <label htmlFor="gameId" className="block text-base-content mb-2">Game</label>
          <select id="gameId" name="gameId" value={teamData.gameId} onChange={handleChange} className="w-full select bg-gray-700" required>
            <option value="" disabled>Select a game</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex items-center gap-4">
          <button type="submit" className="btn bg-secondary text-white" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Team' : 'Create Team')}
          </button>
          <Link to="/admin/manage-teams" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default TeamFormPage;