// frontend/src/components/cards/PlayerCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

const PlayerCard = ({ player }) => {
  return (
    <motion.div 
      className="bg-surface rounded-lg text-center shadow-lg overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-background h-40 flex items-center justify-center p-4">
        <img
          src={player.imageUrl || 'https://via.placeholder.com/150'}
          alt={player.nickname}
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-600"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-main">{player.nickname}</h3>
        {player.realName && <p className="text-sm text-text-secondary">{player.realName}</p>}
        {player.role && <p className="mt-2 text-accent font-semibold">{player.role}</p>}
      </div>
    </motion.div>
  );
};

export default PlayerCard;