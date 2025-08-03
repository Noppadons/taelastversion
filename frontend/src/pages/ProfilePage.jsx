import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCalendarAlt, FaUpload, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profile');
        setProfileData(response.data);
        if (response.data.profileImageUrl) {
          setPreview(response.data.profileImageUrl);
        } else {
          setPreview(`https://ui-avatars.com/api/?name=${response.data.username.substring(0,1)}&background=111827&color=22d3ee&size=128`);
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (user) { fetchProfile(); } 
    else { setLoading(false); setError('You must be logged in to view this page.'); }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setSubmitError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }
    if (currentPassword && newPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    }

    try {
      const response = await apiClient.put('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitSuccess(response.data.message || 'Profile updated successfully!');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSelectedFile(null);
      
      if (response.data.profileImageUrl) {
        setPreview(response.data.profileImageUrl);
        updateUserProfile({ profileImageUrl: response.data.profileImageUrl });
      }

    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-8 text-text-secondary">Loading profile...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 rounded-full group flex-shrink-0">
            <img 
              src={preview} 
              alt="Profile"
              className="object-cover w-full h-full rounded-full" 
            />
            <label htmlFor="profileImageUpload" className="absolute inset-0 bg-black/60 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <FaUpload size={40} />
              <input type="file" id="profileImageUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-text-main">{profileData.username}</h1>
            <p className="text-xl text-text-secondary mt-1">Role: <span className="font-semibold text-accent">{user?.role}</span></p>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="glass-card p-8">
          <h2 className="text-2xl font-bold text-text-main mb-6">Update Your Profile</h2>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">To change your password, fill all three fields below. To only update your profile image, leave password fields blank and choose a new photo.</p>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field bg-black/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field bg-black/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field bg-black/20" />
            </div>
            
            {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
            {submitSuccess && <p className="text-green-400 text-sm">{submitSuccess}</p>}
            
            <div className="pt-4">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                <FaSave className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;