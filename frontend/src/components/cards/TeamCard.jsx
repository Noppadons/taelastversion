import React from 'react';
import { motion } from 'framer-motion';

const TeamCard = ({ team }) => {
  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-surface rounded-lg overflow-hidden shadow-lg h-full flex flex-col group hover:shadow-accent/50 transition-shadow duration-300">
        <div className="w-full h-48 bg-background p-4 flex items-center justify-center">
          <img 
            src={team.logoUrl || 'https://via.placeholder.com/200x100?text=No+Logo'} 
            alt={`${team.name} Logo`} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-text-main mb-2">{team.name}</h2>
          <p className="text-text-secondary mb-4 flex-grow">{team.description || 'No description available.'}</p>
          <div className="flex justify-end mt-auto">
            <span className="bg-accent text-white text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
              {team.game.name}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;