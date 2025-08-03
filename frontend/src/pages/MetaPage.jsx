import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios';
import MetaGuideCard from '../components/cards/MetaGuideCard';
import { motion } from 'framer-motion';

const MetaPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/metas');
        if (Array.isArray(response.data)) {
          setGuides(response.data);
        } else {
          setGuides([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchGuides();
  }, []);

  const gameFilters = useMemo(() => {
    if (!Array.isArray(guides) || guides.length === 0) return ['All'];
    const games = guides
      .filter(guide => guide && guide.game && guide.game.name)
      .map(guide => guide.game.name);
    return ['All', ...new Set(games)];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    if (activeFilter === 'All') return guides;
    return guides.filter(guide => guide && guide.game && guide.game.name === activeFilter);
  }, [guides, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">เมต้าแนะนำ</h1>
          <p className="text-lg text-text-secondary mt-2">กลยุทธ์และข้อมูลเชิงลึกจากทีมของเรา เพื่อช่วยให้คุณครองเกม</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {gameFilters.map(game => (
            <button key={game} onClick={() => setActiveFilter(game)}
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

        {loading ? (
          <p className="text-center text-text-secondary">Loading guides...</p>
        ) : (
          filteredGuides.length > 0 ? (
            <motion.div 
              className="space-y-6 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredGuides.map(guide => (
                guide && <MetaGuideCard key={guide.id} guide={guide} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl text-text-main">No Guides Found</h3>
              <p className="text-text-secondary mt-2">There are currently no guides for the selected game.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MetaPage;