// frontend/src/pages/admin/ManageMetasPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';

const ManageMetasPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
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

  if (loading) return <p>Loading meta guides...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Meta Guides</h1>
        <Link to="/admin/manage-metas/new" className="btn btn-sm bg-secondary text-white">
          + Add New Guide
        </Link>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="text-white">
              <th>ID</th>
              <th>Title</th>
              <th>Game</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map(guide => (
              <tr key={guide.id} className="hover">
                <td>{guide.id}</td>
                <td className="max-w-xs truncate">{guide.title}</td>
                <td>{guide.game.name}</td>
                <td>{guide.author}</td>
                <td className="space-x-2">
                  <Link to={`/admin/manage-metas/edit/${guide.id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                  <button onClick={() => handleDelete(guide.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMetasPage;