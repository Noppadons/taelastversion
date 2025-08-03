import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';

const CommentSection = ({ articleId, articleType }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/comments/${articleType}/${articleId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleId, articleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const payload = {
        text: newComment,
        [`${articleType === 'news' ? 'newsArticleId' : 'metaGuideId'}`]: articleId,
      };
      const response = await apiClient.post('/comments', payload);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment. You might need to log in again.");
    }
  };

  return (
    <aside className="max-w-4xl mx-auto mt-16 pt-8 border-t border-surface">
      <h2 className="text-2xl font-bold text-text-main mb-6">{comments.length} Comments</h2>
      
      <div className="mb-8">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="glass-card p-6">
            <textarea
              className="textarea-field bg-black/20 w-full"
              rows="4"
              placeholder={`Commenting as ${user?.username}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <div className="text-right mt-4">
              <button type="submit" className="btn-primary">Post Comment</button>
            </div>
          </form>
        ) : (
          <div className="glass-card p-6 text-center text-text-secondary">
            <p>You must be <Link to="/login" className="text-accent hover:underline">logged in</Link> to post a comment.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {loading ? <p className="text-text-secondary">Loading comments...</p> : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center font-bold text-accent flex-shrink-0">
                {comment.author.username.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-text-main">
                    {comment.author.username}
                    {comment.author.role === 'ADMIN' && <span className="text-xs bg-accent text-white rounded-full px-2 py-0.5 ml-2">Admin</span>}
                  </p>
                  <p className="text-xs text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-text-secondary mt-1 whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))
        )}
        {!loading && comments.length === 0 && (
          <p className="text-text-secondary italic">No comments yet. Be the first to say something!</p>
        )}
      </div>
    </aside>
  );
};

export default CommentSection;