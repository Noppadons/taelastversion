import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const NewsManagementCard = ({ article, onDelete }) => {
  return (
    <div className="glass-card flex flex-col transition-all duration-300 group hover:border-accent/50">
      <div className="h-40 bg-background rounded-t-2xl">
        <img src={article.imageUrl || 'https://via.placeholder.com/400x250?text=News'} alt={article.title} className="w-full h-full object-cover rounded-t-2xl" />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-text-main leading-tight h-14 overflow-hidden group-hover:text-accent transition-colors">{article.title}</h3>
        <p className="text-xs text-text-secondary mt-2">
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="p-4 bg-black/20 rounded-b-2xl border-t border-white/10 flex justify-between items-center">
        <p className="text-xs text-text-secondary font-mono">ID: {article.id}</p>
        <div className="space-x-2">
          <Link to={`/admin/manage-news/edit/${article.id}`} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-400 hover:text-white" title="Edit">
            <FaEdit size={14}/>
          </Link>
          <button onClick={() => onDelete(article.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
            <FaTrash size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/news');
        setArticles(response.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await apiClient.delete(`/news/${articleId}`);
        setArticles(articles.filter(article => article.id !== articleId));
        alert('Article deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete the article.');
      }
    }
  };

  if (loading) return <p className="text-text-secondary">Loading news articles...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Manage News</h1>
          <p className="text-text-secondary mt-1">Manage all news articles and updates.</p>
        </div>
        <Link to="/admin/manage-news/new" className="btn-primary bg-accent hover:shadow-accent/50">
          <FaPlus className="mr-2" /> Add New Article
        </Link>
      </div>
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search articles..." className="input-field bg-transparent border-none pl-10" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {articles.map(article => (
            <NewsManagementCard key={article.id} article={article} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center glass-card p-12">
          <h3 className="text-2xl font-bold text-text-main">No Articles Found</h3>
          <p className="text-text-secondary mt-2">Click "Add New Article" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageNewsPage;