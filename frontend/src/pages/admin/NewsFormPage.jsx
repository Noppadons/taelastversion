import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaSave, FaUpload } from 'react-icons/fa';

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', author: 'TAE-ESPORT' });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchArticle = async () => {
        try {
          const response = await apiClient.get(`/news/${id}`);
          setFormData(response.data);
          if (response.data.imageUrl) {
            setPreview(response.data.imageUrl);
          }
        } catch (err) {
          setError('Failed to fetch article data.');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEditMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let finalImageUrl = formData.imageUrl;

    if (selectedFile) {
        setUploading(true);
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);
        try {
            const uploadRes = await apiClient.post('/upload', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            finalImageUrl = uploadRes.data.imageUrl;
        } catch (err) {
            setError('Image upload failed.'); setLoading(false); setUploading(false); return;
        }
        setUploading(false);
    }

    const payload = { ...formData, imageUrl: finalImageUrl };

    try {
      if (isEditMode) {
        await apiClient.put(`/news/${id}`, payload);
      } else {
        await apiClient.post('/news', payload);
      }
      alert(`Article ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/manage-news');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p className="text-text-secondary p-8">Loading form...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-main">{isEditMode ? `Edit Article: ${formData.title}` : 'Create New Article'}</h1>
      <form onSubmit={handleSubmit} className="glass-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input-field bg-black/20" required />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">Content</label>
              <textarea id="content" name="content" value={formData.content} onChange={handleChange} className="textarea-field bg-black/20" rows="12" required></textarea>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Featured Image</label>
              <div className="bg-black/20 rounded-lg p-4 h-48 flex items-center justify-center mb-2">
                {preview ? (
                  <img src={preview} alt="Article Preview" className="max-h-full max-w-full object-cover"/>
                ) : (
                  <p className="text-text-secondary text-sm">Image Preview</p>
                )}
              </div>
              <label htmlFor="imageUpload" className="btn-outline w-full cursor-pointer !py-2 !px-3 text-sm">
                <FaUpload className="mr-2"/> <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
              </label>
              <input type="file" id="imageUpload" onChange={handleFileChange} className="hidden" accept="image/*"/>
              {uploading && <p className="text-accent text-sm mt-2 text-center animate-pulse">Uploading image...</p>}
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-text-secondary mb-1">Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="input-field bg-black/20" />
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={loading || uploading}>
            <FaSave className="mr-2" />
            {loading || uploading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Create Article')}
          </button>
          <Link to="/admin/manage-news" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default NewsFormPage;