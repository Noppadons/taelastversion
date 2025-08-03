import React from 'react';
import { motion } from 'framer-motion';

const StatBar = ({ label, value }) => {
  const percentage = Math.max(1, Math.min(100, value || 1));
  let barColor = 'bg-green-500';
  if (percentage < 70) barColor = 'bg-yellow-500';
  if (percentage < 40) barColor = 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="text-text-secondary font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-text-main font-bold">{percentage}</span>
      </div>
      <div className="w-full bg-background rounded-full h-2.5 shadow-inner">
        <motion.div 
          className={`h-2.5 rounded-full ${barColor}`} 
          style={{ width: `0%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default StatBar;