import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios';
import PlayerCard from '../components/cards/PlayerCard';
import { Link } from 'react-router-dom';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeGame, setActiveGame] = useState('All');
  const [activeTeam, setActiveTeam] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [playersResponse, teamsResponse] = await Promise.all([
          apiClient.get('/players'),
          apiClient.get('/teams?limit=1000')
        ]);
        
        setPlayers(playersResponse.data);
        
        if (teamsResponse.data && Array.isArray(teamsResponse.data.data)) {
            setTeams(teamsResponse.data.data);
        } else {
            console.error("Unexpected response structure for teams:", teamsResponse.data);
            setTeams([]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  const gameFilters = useMemo(() => {
    if (!Array.isArray(teams) || teams.length === 0) return ['All'];
    const games = teams.map(team => team.game.name);
    return ['All', ...new Set(games)];
  }, [teams]);
  
  const teamFilters = useMemo(() => {
    if (!Array.isArray(teams) || teams.length === 0) return [];
    if (activeGame === 'All') return teams;
    return teams.filter(team => team.game.name === activeGame);
  }, [teams, activeGame]);

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
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">นักกีฬาในสังกัด</h1>
          <p className="text-lg text-text-secondary mt-2">นักกีฬาดี มีวินัย ใฝ่ศึกษา ล่าท้าฝัน</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        <section className="bg-surface rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-shrink-0 text-text-main font-bold">Filter By:</div>
            <div className="flex flex-wrap gap-2">
                {gameFilters.map(game => (
                    <button key={game} onClick={() => { setActiveGame(game); setActiveTeam('All'); }}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${activeGame === game ? 'bg-accent text-white' : 'bg-background text-text-secondary hover:bg-gray-700'}`}>
                        {game}
                    </button>
                ))}
            </div>
            <div className="md:ml-auto">
                <select 
                    value={activeTeam} 
                    onChange={(e) => setActiveTeam(e.target.value)}
                    className="select-field w-full md:w-auto"
                >
                    <option value="All">All Teams</option>
                    {teamFilters.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
        </section>

        <section>
          {loading ? (
            <p className="text-center text-text-secondary">Loading players...</p>
          ) : (
            filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredPlayers.map(player => (
                  <Link key={player.id} to={`/players/${player.id}`}>
                    <PlayerCard player={player} />
                  </Link>
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