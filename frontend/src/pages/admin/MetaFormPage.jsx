// frontend/src/pages/admin/MetaFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';

const MetaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'TAE Analysis',
    gameId: '',
  });
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (isEditMode) {
      const fetchGuide = async () => {
        try {
          const response = await apiClient.get(`/metas/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError('Failed to fetch meta guide data.');
        }
      };
      fetchGuide();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gameId) {
      setError('Please select a game.');
      return;
    }
    setLoading(true);

    const payload = { ...formData, gameId: parseInt(formData.gameId) };

    try {
      if (isEditMode) {
        await apiClient.put(`/metas/${id}`, payload);
      } else {
        await apiClient.post('/metas', payload);
      }
      alert(`Guide ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-metas');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Meta Guide' : 'Create New Guide'}</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-base-content mb-2">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full input bg-gray-700" required />
        </div>
        <div className="mb-4">
          <label htmlFor="gameId" className="block text-base-content mb-2">Game</label>
          <select id="gameId" name="gameId" value={formData.gameId} onChange={handleChange} className="w-full select bg-gray-700" required>
            <option value="" disabled>Select a game</option>
            {games.map(game => (<option key={game.id} value={game.id}>{game.name}</option>))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-base-content mb-2">Content</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} className="w-full textarea bg-gray-700" rows="10" required></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-base-content mb-2">Author</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn bg-secondary text-white" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Guide' : 'Create Guide')}
          </button>
          <Link to="/admin/manage-metas" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default MetaFormPage;