import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave } from 'react-icons/fa';

const MetaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'TAE Analysis',
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
        const fetchGuide = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/metas/${id}`);
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch meta guide data.');
            } finally {
                setLoading(false);
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

  if (loading && isEditMode) return <p>Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Guide: ${formData.title}` : 'Create New Guide'}</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-lg max-w-4xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-text-secondary mb-1">Game</label>
              <select id="gameId" name="gameId" value={formData.gameId} onChange={handleChange} className="select-field" required>
                <option value="" disabled>Select a game</option>
                {games.map(game => (<option key={game.id} value={game.id}>{game.name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-text-secondary mb-1">Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} className="textarea-field" rows="12" required></textarea>
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}

        <div className="mt-8 pt-6 border-t border-gray-700 flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : (isEditMode ? 'Update Guide' : 'Create Guide')}
          </button>
          <Link to="/admin/manage-metas" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default MetaFormPage;