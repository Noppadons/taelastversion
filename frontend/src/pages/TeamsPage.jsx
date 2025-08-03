import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import TeamCard from '../components/cards/TeamCard';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import Pagination from '../components/Pagination';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true); 
      try {
        const response = await apiClient.get(`/teams?page=${currentPage}&limit=6`);
        setTeams(response.data.data); 
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchTeams();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-background min-h-screen pb-16">
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">รายชื่อทีมของเรา</h1>
          <p className="text-lg text-text-secondary mt-2">หัวใจขององค์กรเรา คือการแข่งขันในระดับสูงสุด ไม่ย่อท้อต่อความยากลำบาก</p>
        </div>
      </section>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <TeamCardSkeleton key={index} />)
          ) : (
            teams.length > 0 ? (
              teams.map((team) => (
                <Link to={`/teams/${team.id}`} key={team.id}>
                    <TeamCard team={team} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl text-text-main">No teams found</h3>
              </div>
            )
          )}
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TeamsPage;