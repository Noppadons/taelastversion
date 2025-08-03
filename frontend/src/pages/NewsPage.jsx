import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import NewsCard from '../components/cards/NewsCard';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/news');
        setArticles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchNews();
  }, []);

  const featuredArticle = useMemo(() => articles[0], [articles]);
  const otherArticles = useMemo(() => articles.slice(1), [articles]);

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">ข่าวสารและอัพเดท</h1>
          <p className="text-lg text-text-secondary mt-2">ติดตามข่าวสารใหม่ ในวงการอีสปอร์ต</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        {loading ? (
          <p className="text-center text-text-secondary">Loading news...</p>
        ) : (
          articles.length > 0 ? (
            <>
              <section className="mb-16">
                <Link to={`/news/${featuredArticle.id}`} className="group block">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface rounded-lg shadow-lg overflow-hidden">
                    <div className="h-64 md:h-full bg-background">
                      <img 
                        src={featuredArticle.imageUrl || 'https://via.placeholder.com/800x600?text=Featured'} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <p className="text-accent font-semibold mb-2">บทความเด่น</p>
                      <h2 className="text-3xl font-bold text-text-main mb-4 group-hover:text-accent transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-text-secondary mb-6">
                        {featuredArticle.content.substring(0, 150)}...
                      </p>
                      <span className="font-bold text-text-main group-hover:underline">อ่านต่อที่นี่ &rarr;</span>
                    </div>
                  </div>
                </Link>
              </section>

              {otherArticles.length > 0 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map(article => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl text-text-main">No News Available</h3>
              <p className="text-text-secondary mt-2">Please check back later for updates.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewsPage;