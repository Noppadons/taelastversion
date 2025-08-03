import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { FaDotCircle } from 'react-icons/fa';
import CommentSection from '../components/CommentSection';

const MetaSection = ({ title, content }) => {
    if (!content) return null;
    return (
        <div className="py-6 border-b border-surface">
            <h2 className="text-2xl font-bold text-accent mb-3 flex items-center gap-3">
                <FaDotCircle size={12} /> {title}
            </h2>
            <div className="prose prose-lg prose-invert max-w-none text-text-secondary whitespace-pre-wrap">
                {content}
            </div>
        </div>
    );
};

const SingleMetaPage = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/metas/${id}`);
        setGuide(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  if (loading) return <p className="text-center p-8 text-text-secondary">Loading guide...</p>;

  if (error || !guide) {
    return (
      <div className="text-center p-16 text-text-secondary">
        <h2 className="text-2xl text-text-main">Guide Not Found</h2>
        <Link to="/meta" className="text-accent hover:underline mt-4 inline-block">&larr; Back to all guides</Link>
      </div>
    );
  }

  return (
    <div className="bg-background pb-16">
      <header className="bg-surface py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-accent">{guide.game.name} Guide</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text-main leading-tight mt-2">{guide.title}</h1>
          <p className="text-text-secondary mt-4">By {guide.author}</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 mt-8">
        <div className="bg-surface p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto">
          {typeof guide.content === 'object' && guide.content !== null ? (
            Object.entries(guide.content).map(([key, value]) => (
              <MetaSection key={key} title={key} content={value} />
            ))
          ) : (
            <article className="prose prose-lg prose-invert max-w-none text-text-secondary">
              {String(guide.content).split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          )}
          <div className="mt-12 pt-8">
            <Link to="/meta" className="btn-ghost">&larr; Back to all guides</Link>
          </div>
        </div>
        
        <CommentSection articleId={id} articleType="metas" />
      </main>
    </div>
  );
};

export default SingleMetaPage;