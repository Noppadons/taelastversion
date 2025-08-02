// frontend/src/pages/SingleNewsPage.jsx (ฉบับแปลงโฉม)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const SingleNewsPage = () => {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/news/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    // อาจจะทำ Skeleton สำหรับหน้านี้ในอนาคต
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
    <div className="bg-background pb-16">
      {/* ===== Cover Image Section ===== */}
      <header className="h-[40vh] md:h-[50vh] w-full bg-surface">
        <img 
          src={article.imageUrl || 'https://via.placeholder.com/1200x400?text=News'} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </header>
      
      {/* ===== Article Content Section ===== */}
      <main className="container mx-auto px-4 -mt-16 md:-mt-24">
        <div className="bg-surface p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto">
          {/* Meta Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-text-main leading-tight">
              {article.title}
            </h1>
            <p className="text-text-secondary mt-4 text-sm">
              By <span className="font-semibold">{article.author}</span>
              <span className="mx-2">|</span>
              Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          
          {/* Article Body */}
          <article className="prose prose-lg prose-invert max-w-none text-text-secondary prose-headings:text-text-main prose-strong:text-text-main prose-a:text-accent hover:prose-a:opacity-80">
            {/* เราใช้ split('\n') และ map เพื่อให้การขึ้นบรรทัดใหม่ (Enter) ใน textarea แสดงผลถูกต้อง */}
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <Link to="/news" className="text-accent hover:underline">
              &larr; ย้อนกลับ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleNewsPage;