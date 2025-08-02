import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave } from 'react-icons/fa';

const PlayerFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nickname: '',
        realName: '',
        imageUrl: '',
        role: '',
        teamId: '',
    });

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await apiClient.get('/teams');
                setTeams(response.data);
            } catch (err) {
                console.error("Failed to fetch teams", err);
            }
        };
        fetchTeams();
        if (isEditMode) {
            const fetchPlayer = async () => {
                try {
                    const response = await apiClient.get(`/players/${id}`);
                    setFormData({
                        nickname: response.data.nickname || '',
                        realName: response.data.realName || '',
                        imageUrl: response.data.imageUrl || '',
                        role: response.data.role || '',
                        teamId: response.data.teamId || '',
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
            <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Player: ${formData.nickname}` : 'Create New Player'}</h1>
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-text-secondary mb-1">Nickname</label>
                            <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label htmlFor="teamId" className="block text-sm font-medium text-text-secondary mb-1">Team</label>
                            <select id="teamId" name="teamId" value={formData.teamId} onChange={handleChange} className="select-field" required>
                                <option value="" disabled>Select a team</option>
                                {teams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="realName" className="block text-sm font-medium text-text-secondary mb-1">Real Name</label>
                                <input type="text" id="realName" name="realName" value={formData.realName} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                                <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-text-secondary mb-1">Photo URL</label>
                        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input-field mb-2" />
                        <div className="bg-background rounded-lg p-4 h-48 flex items-center justify-center">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Player Preview" className="h-full w-full object-cover rounded-md"/>
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
                        {loading ? 'Saving...' : (isEditMode ? 'Update Player' : 'Create Player')}
                    </button>
                    <Link to="/admin/manage-players" className="btn-ghost">Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default PlayerFormPage;