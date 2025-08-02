// frontend/src/pages/TeamsPage.jsx (ฉบับแปลงโฉม)

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios';
import TeamCard from '../components/cards/TeamCard'; // 1. Import TeamCard
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All'); // 2. State สำหรับเก็บ Filter ที่เลือก

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true); 
      try {
        const response = await apiClient.get('/teams');
        setTeams(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchTeams();
  }, []);

  // 3. สร้าง list ของเกมที่ไม่ซ้ำกันเพื่อทำปุ่ม Filter
  const gameFilters = useMemo(() => {
    if (teams.length === 0) return [];
    const games = teams.map(team => team.game.name);
    return ['All', ...new Set(games)];
  }, [teams]);

  // 4. กรองทีมตาม Filter ที่เลือก
  const filteredTeams = useMemo(() => {
    if (activeFilter === 'All') {
      return teams;
    }
    return teams.filter(team => team.game.name === activeFilter);
  }, [teams, activeFilter]);


  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ===== Page Header ===== */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">รายชื่อทีมของเรา</h1>
          <p className="text-lg text-text-secondary mt-2">หัวใจขององค์กรเรา คือการแข่งขันในระดับสูงสุด</p>
        </div>
      </section>

      {/* ===== Filter Section ===== */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {gameFilters.map(game => (
            <button 
              key={game}
              onClick={() => setActiveFilter(game)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeFilter === game 
                ? 'bg-accent text-white' 
                : 'bg-surface text-text-secondary hover:bg-accent hover:text-white'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {/* ===== Teams Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <TeamCardSkeleton />
              <TeamCardSkeleton />
              <TeamCardSkeleton />
            </>
          ) : (
            filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} /> // 5. เรียกใช้ TeamCard Component
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl text-text-main">No teams found</h3>
                <p className="text-text-secondary mt-2">There are currently no teams for the selected game.</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamsPage;