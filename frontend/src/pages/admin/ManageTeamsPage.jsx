import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const TeamManagementCard = ({ team, onDelete }) => {
  return (
    <div className="glass-card flex flex-col transition-all duration-300 group hover:border-accent/50">
      <div className="p-4 rounded-t-2xl flex items-center justify-center h-40">
        <img src={team.logoUrl || 'https://via.placeholder.com/200x100?text=No+Logo'} alt={team.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-text-main truncate group-hover:text-accent transition-colors">{team.name}</h3>
        <p className="text-sm text-text-secondary">{team.game.name}</p>
      </div>
      <div className="p-4 bg-black/20 rounded-b-2xl border-t border-white/10 flex justify-between items-center">
        <p className="text-xs text-text-secondary font-mono">ID: {team.id}</p>
        <div className="space-x-2">
          <Link to={`/admin/manage-teams/edit/${team.id}`} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-400 hover:text-white" title="Edit">
            <FaEdit size={14}/>
          </Link>
          <button onClick={() => onDelete(team.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
            <FaTrash size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/teams?page=${currentPage}&limit=10`);
        setTeams(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [currentPage]);

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await apiClient.delete(`/teams/${teamId}`);
        // Refetch current page data after deletion
        const response = await apiClient.get(`/teams?page=${currentPage}&limit=10`);
        setTeams(response.data.data);
        setPagination(response.data.pagination);
        // If the last item on a page was deleted, go to the previous page
        if (response.data.data.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        alert('Team deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete team.');
      }
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="text-text-secondary p-8">Loading teams...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Manage Teams</h1>
          <p className="text-text-secondary mt-1">Add, edit, or delete your organization's teams.</p>
        </div>
        <Link to="/admin/manage-teams/new" className="btn-primary bg-accent hover:shadow-accent/50">
          <FaPlus className="mr-2" /> Add New Team
        </Link>
      </div>
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search teams..." className="input-field bg-transparent border-none pl-10" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>
      {teams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {teams.map(team => (
              <TeamManagementCard key={team.id} team={team} onDelete={handleDelete} />
            ))}
          </div>
          {pagination && (
            <Pagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center glass-card p-12">
          <h3 className="text-2xl font-bold text-text-main">No Teams Found</h3>
          <p className="text-text-secondary mt-2">Click "Add New Team" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageTeamsPage;