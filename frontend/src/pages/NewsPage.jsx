import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom'; // เพิ่มการ import Link เข้ามา

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiClient.get('/news');
        setArticles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-white">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Latest News</h1>
      
      {articles.length === 0 ? (
        <p className="text-center text-base-content">No news articles found.</p>
      ) : (
        <div className="space-y-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden hover:bg-gray-700 transition-colors duration-300">
              <img 
                src={article.imageUrl || 'https://via.placeholder.com/400x250?text=News'} 
                alt={article.title} 
                className="w-full md:w-1/3 h-64 md:h-auto object-cover"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{article.title}</h2>
                  <p className="text-base-content mb-4">
                    {article.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                        Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </span>
                    {/* แก้ไขจาก button เป็น Link ที่นี่ */}
                    <Link to={`/news/${article.id}`} className="text-secondary hover:text-white font-bold">
                        Read More &rarr;
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;