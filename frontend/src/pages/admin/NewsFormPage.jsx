// frontend/src/pages/admin/NewsFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    author: 'TAE-ESPORT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const response = await apiClient.get(`/news/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError('Failed to fetch article data.');
        }
      };
      fetchArticle();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await apiClient.put(`/news/${id}`, formData);
      } else {
        await apiClient.post('/news', formData);
      }
      alert(`Article ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-news');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Article' : 'Create New Article'}</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-base-content mb-2">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full input bg-gray-700" required />
        </div>
        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-base-content mb-2">Content</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} className="w-full textarea bg-gray-700" rows="10" required></textarea>
        </div>
        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-base-content mb-2">Image URL</label>
          <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>
         {/* Author */}
         <div className="mb-4">
          <label htmlFor="author" className="block text-base-content mb-2">Author</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="w-full input bg-gray-700" />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex items-center gap-4">
          <button type="submit" className="btn bg-secondary text-white" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Create Article')}
          </button>
          <Link to="/admin/manage-news" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default NewsFormPage;