// frontend/src/pages/SingleTeamPage.jsx (ฉบับแปลงโฉม)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import PlayerCard from '../components/cards/PlayerCard'; // 1. Import PlayerCard

const SingleTeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/teams/${id}`);
        setTeam(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8 text-text-secondary">Loading Team Details...</div>;
  }

  if (error || !team) {
    return (
        <div className="text-center p-16 text-text-secondary">
          <h2 className="text-2xl text-text-main">Team Not Found</h2>
          <p>The requested team could not be found.</p>
          <Link to="/teams" className="text-accent hover:underline mt-4 inline-block">
            &larr; ย้อนกลับ
          </Link>
        </div>
      );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ===== Team Banner Section ===== */}
      <section className="bg-surface pt-24 pb-12 text-center relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-4">
            <img 
              src={team.logoUrl || 'https://via.placeholder.com/150'} 
              alt={`${team.name} Logo`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-accent object-contain bg-background"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-main">{team.name}</h1>
          <p className="text-xl text-accent font-bold mt-2">{team.game.name}</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        {/* ===== Team Description ===== */}
        {team.description && (
          <section className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-lg text-text-secondary">{team.description}</p>
          </section>
        )}
        
        {/* ===== Roster Section ===== */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-text-main text-center">รายชื่อนักกีฬา</h2>
          {team.players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {team.players.map(player => (
                <PlayerCard key={player.id} player={player} /> // 2. เรียกใช้ PlayerCard
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center">ยังไม่มีผู้เล่นในทีมนี้</p>
          )}
        </section>

        <div className="text-center mt-16">
            <Link to="/teams" className="text-accent hover:underline">
              &larr; ย้อนกลับ
            </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleTeamPage;