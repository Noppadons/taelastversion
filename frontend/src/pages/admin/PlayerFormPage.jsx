import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave } from 'react-icons/fa';

const STAT_DEFINITIONS = {
  'DOTA2': { 
    'อ่านเกม (Game Sense)': 50, 'ฮีโร่พูล (Hero Pool)': 50, 'รีเฟล็ก (Reflex)': 50, 'เกมเพลย์ (Gameplay)': 50,
    'จุดเด่น (Strengths)': '', 'จุดด้อย (Weaknesses)': '',
  },
  'PUBG': { 'Aim': 50, 'Game Sense': 50, 'Positioning': 50, 'Utility Usage': 50, 'Clutch Potential': 50 },
};

const normalizeGameName = (name) => {
  if (!name) return '';
  return name.toUpperCase().replace(/[\s-]/g, '');
};

const PlayerFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ nickname: '', realName: '', imageUrl: '', role: '', teamId: '' });
    const [statsData, setStatsData] = useState({});

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const teamsRes = await apiClient.get('/teams?limit=1000');
                setTeams(teamsRes.data.data);

                if (isEditMode) {
                    const playerRes = await apiClient.get(`/players/${id}`);
                    const playerData = playerRes.data;
                    setFormData({
                        nickname: playerData.nickname || '', realName: playerData.realName || '',
                        imageUrl: playerData.imageUrl || '', role: playerData.role || '',
                        teamId: playerData.teamId || '',
                    });
                    const playerTeam = teamsRes.data.data.find(t => t.id === playerData.teamId);
                    if (playerTeam) {
                        const gameName = normalizeGameName(playerTeam.game.name);
                        const statDefaults = STAT_DEFINITIONS[gameName] || {};
                        const existingStats = playerData.stats.find(s => s.gameId === playerTeam.game.id);
                        setStatsData({ ...statDefaults, ...(existingStats ? existingStats.stats : {}) });
                    }
                }
            } catch (err) {
                setError('Failed to fetch initial data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const selectedTeam = useMemo(() => teams.find(t => t.id === parseInt(formData.teamId)), [teams, formData.teamId]);
    const gameForStats = selectedTeam?.game;
    const statsFields = gameForStats ? STAT_DEFINITIONS[normalizeGameName(gameForStats.name)] : null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleStatChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            const clampedValue = Math.max(1, Math.min(100, Number(value) || 1));
            setStatsData(prevStats => ({...prevStats, [name]: clampedValue}));
        } else {
            setStatsData(prevStats => ({...prevStats, [name]: value}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.teamId) {
            setError('Please select a team.');
            return;
        }
        setLoading(true);
        try {
            let playerId = id;
            if (isEditMode) {
                await apiClient.put(`/players/${id}`, formData);
            } else {
                const response = await apiClient.post('/players', formData);
                playerId = response.data.id;
            }
            if (gameForStats && statsData && Object.keys(statsData).length > 0) {
                await apiClient.put(`/players/${playerId}/stats`, {
                    gameId: gameForStats.id,
                    stats: statsData,
                });
            }
            alert(`Player ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate('/admin/manage-players');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? 'Loading Player Data...' : 'Create New Player'}</h1>
                <div className="glass-card p-8"><p className="text-text-secondary">Loading form...</p></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Player: ${formData.nickname}` : 'Create New Player'}</h1>
            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-text-secondary mb-1">Nickname</label>
                            <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} className="input-field bg-black/20" required />
                        </div>
                        <div>
                            <label htmlFor="teamId" className="block text-sm font-medium text-text-secondary mb-1">Team</label>
                            <select id="teamId" name="teamId" value={formData.teamId} onChange={handleChange} className="select-field bg-black/20" required>
                                <option value="" disabled>Select a team</option>
                                {teams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="realName" className="block text-sm font-medium text-text-secondary mb-1">Real Name</label>
                                <input type="text" id="realName" name="realName" value={formData.realName} onChange={handleChange} className="input-field bg-black/20" />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                                <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className="input-field bg-black/20" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-text-secondary mb-1">Photo URL</label>
                        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input-field bg-black/20 mb-2" />
                        <div className="bg-black/20 rounded-lg p-4 h-48 flex items-center justify-center">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Player Preview" className="h-full w-full object-cover rounded-md"/>
                            ) : (
                                <p className="text-text-secondary text-sm">Image Preview</p>
                            )}
                        </div>
                    </div>
                </div>

                {statsFields && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h2 className="text-xl font-bold text-text-main mb-4">Player Stats for <span className="text-accent">{gameForStats.name}</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(statsFields).map(([statName, defaultValue]) => (
                                <div key={statName} className={typeof defaultValue === 'string' ? 'md:col-span-2' : ''}>
                                    <label htmlFor={statName} className="block text-sm font-medium text-text-secondary mb-1">{statName.replace(/_/g, ' ')}</label>
                                    {typeof defaultValue === 'number' ? (
                                        <input type="number" min="1" max="100" id={statName} name={statName} value={statsData[statName] ?? defaultValue} onChange={handleStatChange} className="input-field bg-black/20" />
                                    ) : (
                                        <textarea id={statName} name={statName} value={statsData[statName] ?? ''} onChange={handleStatChange} className="textarea-field bg-black/20" rows={3} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {error && <p className="text-red-500 mt-6">{error}</p>}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                    <button type="submit" className="btn-primary bg-accent hover:shadow-accent/50" disabled={loading}>
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