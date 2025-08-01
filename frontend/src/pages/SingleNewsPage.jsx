// frontend/src/pages/SingleNewsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const SingleNewsPage = () => {
  // 1. ใช้ useParams() เพื่อดึง "id" จาก URL (เช่น /news/1 -> id คือ "1")
  const { id } = useParams(); 

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 2. ยิง API ไปยัง endpoint สำหรับข้อมูลชิ้นเดียว
        const response = await apiClient.get(`/news/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // 3. ให้ useEffect ทำงานใหม่ทุกครั้งที่ "id" ใน URL เปลี่ยนไป

  if (loading) {
    return <div className="text-center p-8 text-white">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="text-center p-8 text-red-500">Error: {error || "Article not found"}</div>;
  }

  return (
    <div className="container mx-auto p-8 text-white">
      {/* Cover Image */}
      <img 
        src={article.imageUrl || 'https://via.placeholder.com/1200x400?text=News'} 
        alt={article.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />

      {/* Title */}
      <h1 className="text-5xl font-bold mb-4">{article.title}</h1>

      {/* Meta Info (Author & Date) */}
      <div className="text-base-content mb-8">
        <span>By {article.author}</span>
        <span className="mx-2">|</span>
        <span>
          Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </span>
      </div>

      {/* Full Content */}
      <div className="prose prose-invert max-w-none text-lg leading-relaxed">
        {/* เราจะใช้ dangerouslySetInnerHTML หาก content มี HTML หรือใช้ whitespace-pre-wrap สำหรับ text ธรรมดา */}
        <p className="whitespace-pre-wrap">{article.content}</p>
      </div>

      <div className="mt-12">
        <Link to="/news" className="text-secondary hover:underline">
          &larr; Back to all news
        </Link>
      </div>
    </div>
  );
};

export default SingleNewsPage;