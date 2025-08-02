import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const MetaManagementCard = ({ guide, onDelete }) => {
  return (
    <div className="bg-surface rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:shadow-accent/40 hover:-translate-y-1">
      <div className="p-4 flex-grow">
        <p className="text-xs font-bold text-accent uppercase">{guide.game.name}</p>
        <h3 className="font-bold text-lg text-text-main leading-tight mt-1 h-14 overflow-hidden">{guide.title}</h3>
        <p className="text-xs text-text-secondary mt-2">by {guide.author}</p>
      </div>
      <div className="p-4 bg-background/50 rounded-b-lg border-t border-surface flex justify-between items-center">
        <p className="text-xs text-text-secondary font-mono">ID: {guide.id}</p>
        <div className="space-x-2">
          <Link to={`/admin/manage-metas/edit/${guide.id}`} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-400 hover:text-white" title="Edit">
            <FaEdit size={14}/>
          </Link>
          <button onClick={() => onDelete(guide.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
            <FaTrash size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageMetasPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/metas');
        setGuides(response.data);
      } catch (err) {
        console.error("Failed to fetch meta guides", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const handleDelete = async (guideId) => {
    if (window.confirm('Are you sure you want to delete this meta guide?')) {
      try {
        await apiClient.delete(`/metas/${guideId}`);
        setGuides(guides.filter(guide => guide.id !== guideId));
        alert('Meta guide deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete the guide.');
      }
    }
  };

  if (loading) return <p className="text-text-secondary">Loading meta guides...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Manage Meta Guides</h1>
          <p className="text-text-secondary mt-1">Manage all strategy guides and analyses.</p>
        </div>
        <Link to="/admin/manage-metas/new" className="btn-primary">
          <FaPlus className="mr-2" /> Add New Guide
        </Link>
      </div>
      <div className="bg-surface p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search guides..." className="input-field pl-10" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>
      {guides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {guides.map(guide => (
            <MetaManagementCard key={guide.id} guide={guide} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-surface rounded-lg p-12">
          <h3 className="text-2xl font-bold text-text-main">No Guides Found</h3>
          <p className="text-text-secondary mt-2">Click "Add New Guide" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageMetasPage;