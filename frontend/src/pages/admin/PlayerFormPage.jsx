import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave, FaUpload } from 'react-icons/fa';

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
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const teamsRes = await apiClient.get('/teams?limit=1000');
                setTeams(teamsRes.data.data);

                if (isEditMode) {
                    const playerRes = await apiClient.get(`/players/${id}`);
                    const playerData = playerRes.data;
                    setFormData(playerData);
                    if (playerData.imageUrl) {
                        setPreview(playerData.imageUrl);
                    }
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          setPreview(URL.createObjectURL(file));
        }
    };

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
        let finalImageUrl = formData.imageUrl;

        if (selectedFile) {
            setUploading(true);
            const imageFormData = new FormData();
            imageFormData.append('image', selectedFile);
            try {
                const uploadRes = await apiClient.post('/upload', imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data.imageUrl;
            } catch (err) {
                setError('Image upload failed.'); setLoading(false); setUploading(false); return;
            }
            setUploading(false);
        }

        const playerPayload = { ...formData, imageUrl: finalImageUrl };
        
        try {
            let playerId = id;
            if (isEditMode) {
                await apiClient.put(`/players/${id}`, playerPayload);
            } else {
                const response = await apiClient.post('/players', playerPayload);
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
        return ( <div className="p-8"><h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? 'Loading Player Data...' : 'Create New Player'}</h1><div className="glass-card p-8"><p className="text-text-secondary">Loading form...</p></div></div>);
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
                        <label className="block text-sm font-medium text-text-secondary mb-1">Player Photo</label>
                        <div className="bg-black/20 rounded-lg p-4 h-48 flex items-center justify-center mb-2">
                            {preview ? (
                                <img src={preview} alt="Player Preview" className="h-full w-full object-cover rounded-md"/>
                            ) : (
                                <p className="text-text-secondary text-sm">Image Preview</p>
                            )}
                        </div>
                        <label htmlFor="imageUpload" className="btn-outline w-full cursor-pointer !py-2 !px-3 text-sm">
                            <FaUpload className="mr-2"/> <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
                        </label>
                        <input type="file" id="imageUpload" onChange={handleFileChange} className="hidden" accept="image/*"/>
                        {uploading && <p className="text-accent text-sm mt-2 text-center animate-pulse">Uploading image...</p>}
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
                    <button type="submit" className="btn-primary" disabled={loading || uploading}>
                        <FaSave className="mr-2" />
                        {loading || uploading ? 'Saving...' : (isEditMode ? 'Update Player' : 'Create Player')}
                    </button>
                    <Link to="/admin/manage-players" className="btn-ghost">Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default PlayerFormPage;