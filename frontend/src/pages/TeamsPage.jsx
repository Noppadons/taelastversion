// frontend/src/pages/TeamsPage.jsx (ฉบับสมบูรณ์)

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom'; // 1. Import Link

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get('/teams');
        setTeams(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-white">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Our Teams</h1>
      {teams.length === 0 ? (
        <p className="text-center text-base-content">No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            // 2. ครอบการ์ดทั้งหมดด้วย Link
            <Link to={`/teams/${team.id}`} key={team.id}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col hover:shadow-secondary transition-shadow duration-300">
                <img 
                  src={team.logoUrl || 'https://via.placeholder.com/400x200?text=No+Logo'} 
                  alt={`${team.name} Logo`} 
                  className="w-full h-48 object-contain bg-black p-4"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-white mb-2">{team.name}</h2>
                  <p className="text-base-content mb-4 flex-grow">{team.description || 'No description available.'}</p>
                  <div className="flex justify-end mt-auto">
                    <span className="bg-secondary text-white text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                      {team.game.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;