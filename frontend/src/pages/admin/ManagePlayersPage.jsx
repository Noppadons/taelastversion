import React, { useState, useEffect, useCallback } from 'react'; // เพิ่ม useCallback
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const PlayerManagementCard = ({ player, onDelete }) => { /* ... โค้ดเดิม ... */ };

const ManagePlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [triggerFetch, setTriggerFetch] = useState(0); // State ใหม่เพื่อ trigger การ fetch

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/players?page=${currentPage}&limit=10`);
      setPlayers(response.data.data);
      setPagination(response.data.pagination);

      // ถ้าหน้าปัจจุบันที่ดึงมาไม่มีข้อมูล (เช่น เพิ่งลบคนสุดท้ายไป) และไม่ใช่หน้า 1
      // ให้ลองกลับไปหน้าก่อนหน้า
      if (response.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(p => p - 1);
      }
    } catch (err) {
      console.error("Failed to fetch players", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers, triggerFetch]); // ทำงานเมื่อ fetchPlayers หรือ triggerFetch เปลี่ยน

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await apiClient.delete(`/players/${playerId}`);
        alert('Player deleted successfully!');
        
        // เมื่อลบสำเร็จ ก็แค่สั่งให้ดึงข้อมูลใหม่โดยการอัปเดต state นี้
        setTriggerFetch(c => c + 1);

      } catch (err) {
        alert('Error: Could not delete the player.');
        console.error("Failed to delete player", err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="text-text-secondary p-8">Loading players...</p>;

  return (
    <div className="space-y-8">
      {/* ... Header and Search Bar ... */}

      {players.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {players.map(player => (
              <PlayerManagementCard key={player.id} player={player} onDelete={handleDelete} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && ( // แสดงผลเมื่อมีมากกว่า 1 หน้า
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center p-8">
            <p className="text-text-secondary">No players found.</p>
        </div>
      )}
    </div>
  );
};

export default ManagePlayersPage;