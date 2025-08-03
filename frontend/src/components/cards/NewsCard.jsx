import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link to={`/news/${article.id}`} className="group block bg-surface rounded-lg shadow-lg overflow-hidden h-full hover:shadow-accent/40 transition-shadow duration-300">
        <div className="h-48 bg-background">
          <img 
            src={article.imageUrl || 'https://via.placeholder.com/400x250?text=News'} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <p className="text-sm text-text-secondary mb-2">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
          <h3 className="text-xl font-bold text-text-main group-hover:text-accent transition-colors duration-300 leading-tight">
            {article.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;