// frontend/src/pages/admin/ManageCommentsPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const ManageCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/admin/comments?page=${currentPage}&limit=15`);
        setComments(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [currentPage]);

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment permanently?')) {
      try {
        await apiClient.delete(`/admin/comments/${commentId}`);
        // Refetch comments after deletion
        const response = await apiClient.get(`/admin/comments?page=${currentPage}&limit=15`);
        setComments(response.data.data);
        setPagination(response.data.pagination);
        alert('Comment deleted successfully!');
      } catch (err) {
        alert('Error: Could not delete comment.');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="text-text-secondary p-8">Loading comments...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Manage Comments</h1>
        <p className="text-text-secondary mt-1">Review and moderate user comments.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr className="text-text-secondary uppercase text-xs tracking-wider">
                <th className="p-4">Author</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Context</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {comments.length > 0 ? comments.map(comment => (
                <tr key={comment.id} className="hover:bg-black/20 transition-colors">
                  <td className="p-4 font-semibold text-text-main">{comment.author.username}</td>
                  <td className="p-4 text-text-secondary max-w-md truncate">{comment.text}</td>
                  <td className="p-4">
                    {comment.newsArticle ? (
                      <Link to={`/news/${comment.newsArticle.id}`} target="_blank" className="text-accent text-sm hover:underline flex items-center gap-2">
                        News: {comment.newsArticle.title} <FaExternalLinkAlt size={12} />
                      </Link>
                    ) : comment.metaGuide ? (
                      <Link to={`/meta/${comment.metaGuide.id}`} target="_blank" className="text-accent text-sm hover:underline flex items-center gap-2">
                        Meta: {comment.metaGuide.title} <FaExternalLinkAlt size={12} />
                      </Link>
                    ) : 'N/A'}
                  </td>
                  <td className="p-4 text-text-secondary text-sm">{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(comment.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-500 hover:text-white" title="Delete">
                      <FaTrash size={16}/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-text-secondary">
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ManageCommentsPage;