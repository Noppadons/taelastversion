// frontend/src/pages/admin/ManageNewsPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';

const ManageNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
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

  if (loading) return <p>Loading news...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage News</h1>
        <Link to="/admin/manage-news/new" className="btn btn-sm bg-secondary text-white">
          + Add New Article
        </Link>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="text-white">
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="hover">
                <td>{article.id}</td>
                <td className="max-w-xs truncate">{article.title}</td>
                <td>{article.author}</td>
                <td>{new Date(article.publishedAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <Link to={`/admin/manage-news/edit/${article.id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                  <button onClick={() => handleDelete(article.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNewsPage;