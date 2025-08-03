import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import SocialShare from '../components/SocialShare';
import CommentSection from '../components/CommentSection';

const SingleNewsPage = () => {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const [articleResponse, allNewsResponse] = await Promise.all([
            apiClient.get(`/news/${id}`),
            apiClient.get('/news')
        ]);
        setArticle(articleResponse.data);
        const otherNews = allNewsResponse.data.filter(a => a.id !== parseInt(id));
        setRelatedNews(otherNews.sort(() => 0.5 - Math.random()).slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8 text-text-secondary">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="text-center p-16 text-text-secondary">
        <h2 className="text-2xl text-text-main">Article Not Found</h2>
        <p>The requested article could not be found.</p>
        <Link to="/news" className="text-accent hover:underline mt-4 inline-block">
          &larr; ย้อนกลับ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background pb-16 pt-8">
      <main className="container mx-auto px-4">
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <Link to="/news" className="text-accent hover:underline text-sm font-semibold">
              &larr; NEWS
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-text-main leading-tight mt-4">
              {article.title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 text-sm text-text-secondary border-y border-surface py-4">
                <p>
                  By <span className="font-semibold text-text-main">{article.author}</span>
                  <span className="mx-2">|</span>
                  Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <SocialShare title={article.title} />
            </div>
          </header>

          {article.imageUrl && (
            <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
              <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none text-text-secondary prose-headings:text-text-main prose-strong:text-text-main prose-a:text-accent hover:prose-a:opacity-80">
            {article.content.split('\n').map((paragraph, index) => (
              paragraph.trim() !== '' && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {relatedNews.length > 0 && (
            <aside className="max-w-4xl mx-auto mt-16 pt-8 border-t border-surface">
                <h2 className="text-2xl font-bold text-text-main mb-6">Related News</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedNews.map(related => (
                        <Link key={related.id} to={`/news/${related.id}`} className="group block bg-surface rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                            <img src={related.imageUrl || 'https://via.placeholder.com/300x200'} alt={related.title} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-text-main leading-tight">{related.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </aside>
        )}

        <CommentSection articleId={id} articleType="news" />
      </main>
    </div>
  );
};

export default SingleNewsPage;