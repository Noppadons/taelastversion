// frontend/src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaTwitch, FaYoutube, FaFacebook, FaEdit } from 'react-icons/fa';

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth(); // user ที่ login อยู่
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/users/${username}`);
        setProfileData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <p className="text-center p-8 text-text-secondary">Loading profile...</p>;
  if (!profileData) return <p className="text-center p-8 text-red-500">User not found.</p>;

  const isOwner = loggedInUser?.username === profileData.username;
  const socialLinks = profileData.socialLinks || {};

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${profileData.username.substring(0,2)}&background=111827&color=22d3ee&size=128`}
            alt={profileData.username}
            className="w-40 h-40 rounded-full border-4 border-accent object-cover"
          />
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-text-main">{profileData.username}</h1>
            <div className="flex items-center gap-4 mt-4">
              {socialLinks.twitch && <a href={`https://twitch.tv/${socialLinks.twitch}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-[#9146FF]"><FaTwitch size={24}/></a>}
              {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-[#FF0000]"><FaYoutube size={24}/></a>}
              {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-[#1877F2]"><FaFacebook size={24}/></a>}
            </div>
          </div>
          {/* ปุ่ม Edit จะแสดงก็ต่อเมื่อเป็นเจ้าของโปรไฟล์ */}
          {isOwner && (
            <Link to="/profile/settings" className="btn-outline ml-auto">
              <FaEdit className="mr-2" /> Edit Profile
            </Link>
          )}
        </div>
      </section>

      <div className="container mx-auto p-8 max-w-4xl">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-text-main mb-4">About Me</h2>
          <p className="text-text-secondary whitespace-pre-wrap">
            {profileData.bio || `${profileData.username} has not written a bio yet.`}
          </p>
        </div>
        {/* ในอนาคต เราสามารถเพิ่มส่วนแสดงประวัติคอมเมนต์ของผู้ใช้ที่นี่ได้ */}
      </div>
    </div>
  );
};

export default UserProfilePage;