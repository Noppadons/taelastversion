import React, { useState, useEffect, useCallback } from 'react'; // เพิ่ม useCallback
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const NewsManagementCard = ({ article, onDelete }) => { /* ... โค้ดเดิม ... */ };

const ManageNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [triggerFetch, setTriggerFetch] = useState(0); // State ใหม่เพื่อ trigger การ fetch

  // ใช้ useCallback เพื่อไม่ให้ฟังก์ชันนี้ถูกสร้างใหม่ทุกครั้งที่ re-render
  // ยกเว้นเมื่อ currentPage เปลี่ยน
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/news?page=${currentPage}&limit=10`);
      setArticles(response.data.data);
      setPagination(response.data.pagination);

      // ถ้าหน้าที่ดึงมาไม่มีข้อมูลเลย และไม่ใช่หน้า 1 ให้กลับไปหน้าก่อนหน้า
      if (response.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(p => p - 1);
      }

    } catch (err) {
      console.error("Failed to fetch news", err);
      // อาจจะตั้งค่า error state ที่นี่เพื่อแสดงผลบน UI
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, triggerFetch]); // ให้ useEffect ทำงานเมื่อ fetchArticles หรือ triggerFetch เปลี่ยน

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await apiClient.delete(`/news/${articleId}`);
        alert('Article deleted successfully!');
        
        // หลังจากลบสำเร็จ ให้ trigger การ fetch ข้อมูลใหม่อีกครั้ง
        // ด้วยการเปลี่ยนค่า state `triggerFetch`
        setTriggerFetch(c => c + 1);

      } catch (err) {
        alert('Error: Could not delete the article.');
        console.error("Failed to delete article", err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="text-text-secondary p-8">Loading news articles...</p>;

  return (
    <div className="space-y-8">
      {/* ... Header and Search Bar ... */}

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {articles.map(article => (
              <NewsManagementCard key={article.id} article={article} onDelete={handleDelete} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center p-8">
            <p className="text-text-secondary">No news articles found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageNewsPage;