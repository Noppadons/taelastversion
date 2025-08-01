// frontend/src/pages/SingleTeamPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const SingleTeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
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
    return <div className="text-center p-8 text-white">Loading Team Details...</div>;
  }

  if (error || !team) {
    return <div className="text-center p-8 text-red-500">Error: {error || "Team not found"}</div>;
  }

  return (
    <div className="container mx-auto p-8 text-white">
      {/* Team Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <img 
          src={team.logoUrl || 'https://via.placeholder.com/150'} 
          alt={`${team.name} Logo`}
          className="w-48 h-48 rounded-full border-4 border-secondary object-contain bg-black"
        />
        <div>
          <span className="text-secondary font-bold">{team.game.name}</span>
          <h1 className="text-6xl font-extrabold">{team.name}</h1>
          <p className="text-base-content mt-4 max-w-2xl">{team.description}</p>
        </div>
      </div>

      {/* Players Roster */}
      <h2 className="text-4xl font-bold mb-8 border-b-2 border-secondary pb-2">Roster</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {team.players.length > 0 ? (
          team.players.map(player => (
            <div key={player.id} className="bg-gray-800 p-4 rounded-lg text-center shadow-lg">
              <img
                src={player.imageUrl || 'https://via.placeholder.com/150'}
                alt={player.nickname}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-600"
              />
              <h3 className="text-xl font-bold text-white">{player.nickname}</h3>
              <p className="text-base-content">{player.role}</p>
            </div>
          ))
        ) : (
          <p className="text-base-content col-span-full text-center">No players on this team yet.</p>
        )}
      </div>
      <div className="mt-12">
        <Link to="/teams" className="text-secondary hover:underline">
          &larr; Back to all teams
        </Link>
      </div>
    </div>
  );
};

export default SingleTeamPage;