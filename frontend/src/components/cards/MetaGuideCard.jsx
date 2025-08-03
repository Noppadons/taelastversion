import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MetaGuideCard = ({ guide }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={itemVariants}>
      <Link to={`/meta/${guide.id}`} className="block group">
        <div className="bg-surface p-6 rounded-lg transition-colors duration-300 group-hover:bg-gray-700 flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <span className="text-3xl bg-background w-16 h-16 rounded-lg flex items-center justify-center font-bold text-accent">
              {guide.game.name.substring(0, 2)}
            </span>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold text-text-main group-hover:text-accent transition-colors">
              {guide.title}
            </h3>
            <p className="text-text-secondary mt-1 text-sm">
              A guide for <span className="font-semibold text-accent">{guide.game.name}</span> by {guide.author}
            </p>
          </div>
          <div className="text-text-secondary group-hover:text-white transition-colors ml-auto flex-shrink-0">
            &rarr;
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MetaGuideCard;