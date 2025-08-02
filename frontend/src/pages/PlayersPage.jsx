// frontend/src/pages/PlayersPage.jsx (ฉบับแปลงโฉม)

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios';
import PlayerCard from '../components/cards/PlayerCard'; // 1. Import PlayerCard

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]); // State สำหรับเก็บข้อมูลทีมทั้งหมดเพื่อใช้กรอง
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับเก็บ Filter ที่เลือก
  const [activeGame, setActiveGame] = useState('All');
  const [activeTeam, setActiveTeam] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลทั้งผู้เล่นและทีมมาพร้อมกัน
        const [playersResponse, teamsResponse] = await Promise.all([
          apiClient.get('/players'),
          apiClient.get('/teams')
        ]);
        setPlayers(playersResponse.data);
        setTeams(teamsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  // สร้าง list ของเกมที่ไม่ซ้ำกัน
  const gameFilters = useMemo(() => {
    if (teams.length === 0) return [];
    const games = teams.map(team => team.game.name);
    return ['All', ...new Set(games)];
  }, [teams]);
  
  // สร้าง list ของทีมที่จะแสดงใน dropdown โดยจะเปลี่ยนไปตามเกมที่เลือก
  const teamFilters = useMemo(() => {
    if (activeGame === 'All') return teams;
    return teams.filter(team => team.game.name === activeGame);
  }, [teams, activeGame]);

  // กรองผู้เล่นตามเกมและทีมที่เลือก
  const filteredPlayers = useMemo(() => {
    let tempPlayers = players;
    if (activeGame !== 'All') {
      tempPlayers = tempPlayers.filter(player => player.team?.game.name === activeGame);
    }
    if (activeTeam !== 'All') {
      tempPlayers = tempPlayers.filter(player => player.team?.id === parseInt(activeTeam));
    }
    return tempPlayers;
  }, [players, activeGame, activeTeam]);

  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">นักกีฬาของเรา</h1>
          <p className="text-lg text-text-secondary mt-2">นักกีฬาทุกคนคือแรงขับเคลื่อนที่ดีที่สุด</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        {/* Filter Section */}
        <section className="bg-surface rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-shrink-0 text-text-main font-bold">Filter by:</div>
            {/* Game Filter */}
            <div className="flex flex-wrap gap-2">
                {gameFilters.map(game => (
                    <button key={game} onClick={() => { setActiveGame(game); setActiveTeam('All'); }}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${activeGame === game ? 'bg-accent text-white' : 'bg-background text-text-secondary hover:bg-gray-700'}`}>
                        {game}
                    </button>
                ))}
            </div>
            {/* Team Filter */}
            <div className="md:ml-auto">
                <select 
                    value={activeTeam} 
                    onChange={(e) => setActiveTeam(e.target.value)}
                    className="select bg-background border-gray-600 text-text-main focus:border-accent w-full md:w-auto"
                >
                    <option value="All">All Teams</option>
                    {teamFilters.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
        </section>

        {/* Players Grid */}
        <section>
          {loading ? (
            <p className="text-center text-text-secondary">Loading players...</p>
          ) : (
            filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl text-text-main">No Players Found</h3>
                <p className="text-text-secondary mt-2">There are no players matching your filter criteria.</p>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
};

export default PlayersPage;