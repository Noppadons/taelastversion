import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import StatBar from '../components/StatBar';

const SinglePlayerPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/players/${id}`);
        setPlayer(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8 text-text-secondary">Loading Player Profile...</div>;
  }

  if (error || !player) {
    return (
      <div className="text-center p-16 text-text-secondary">
        <h2 className="text-2xl text-text-main">Player Not Found</h2>
        <p>The requested player could not be found.</p>
        <Link to="/players" className="text-accent hover:underline mt-4 inline-block">
          &larr; Back to all players
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={player.imageUrl || 'https://via.placeholder.com/150'} 
            alt={player.nickname}
            className="w-40 h-40 rounded-full border-4 border-accent object-cover"
          />
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-text-main">{player.nickname}</h1>
            <p className="text-xl text-text-secondary mt-1">{player.realName}</p>
            {player.team && (
              <Link to={`/teams/${player.team.id}`} className="inline-flex items-center gap-2 mt-4">
                <img src={player.team.logoUrl} alt={player.team.name} className="w-8 h-8"/>
                <span className="font-bold text-lg text-text-main hover:text-accent transition-colors">{player.team.name}</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-text-main">ค่าสถานะ ของนักกีฬา</h2>
          {player.stats.length > 0 ? (
            <div className="bg-surface rounded-lg shadow-lg p-6 space-y-6">
              {player.stats.map(gameStat => {
                 const statEntries = Object.entries(gameStat.stats);
                 const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);
                 const numericStats = statEntries.filter(([_, value]) => isNumeric(value));
                 const textStats = statEntries.filter(([_, value]) => !isNumeric(value));

                 return (
                  <div key={gameStat.id}>
                    <h3 className="text-2xl font-bold text-accent mb-4 border-b-2 border-accent/20 pb-2">{gameStat.game.name}</h3>
                    <div className="space-y-4">
                      {numericStats.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                          {numericStats.map(([statName, statValue]) => (
                            <StatBar key={statName} label={statName} value={Number(statValue)} />
                          ))}
                        </div>
                      )}
                      {textStats.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-background mt-4">
                          {textStats.map(([statName, statValue]) => (
                            statValue && <div key={statName}>
                              <p className="text-text-secondary uppercase text-xs tracking-wider font-semibold">{statName}</p>
                              <p className="text-text-main whitespace-pre-wrap">{String(statValue)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                 )
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-center italic bg-surface p-8 rounded-lg">No stats available for this player.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerPage;