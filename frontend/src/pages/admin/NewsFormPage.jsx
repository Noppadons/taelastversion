import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave } from 'react-icons/fa';

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    author: 'TAE-ESPORT',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(`/news/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError('Failed to fetch article data.');
        } finally {
          setLoading(false);
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

  if (loading && isEditMode) return <p>Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Article: ${formData.title}` : 'Create New Article'}</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">Content</label>
              <textarea id="content" name="content" value={formData.content} onChange={handleChange} className="textarea-field" rows="12" required></textarea>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
              <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input-field mb-2" />
              <div className="bg-background rounded-lg p-4 h-48 flex items-center justify-center">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Article Preview" className="max-h-full max-w-full object-cover"/>
                ) : (
                  <p className="text-text-secondary text-sm">Image Preview</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-text-secondary mb-1">Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}

        <div className="mt-8 pt-6 border-t border-gray-700 flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Create Article')}
          </button>
          <Link to="/admin/manage-news" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default NewsFormPage;