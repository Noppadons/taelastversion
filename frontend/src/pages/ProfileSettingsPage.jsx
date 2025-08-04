import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaUpload, FaSave } from 'react-icons/fa';

const ProfileSettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({ twitch: '', youtube: '', facebook: '' });
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
        setBio(response.data.bio || '');
        if(response.data.socialLinks && typeof response.data.socialLinks === 'object') {
          setSocialLinks(response.data.socialLinks);
        }
        if (response.data.profileImageUrl) {
          setPreview(response.data.profileImageUrl);
        } else if (response.data.username) {
          setPreview(`https://ui-avatars.com/api/?name=${response.data.username.substring(0,2)}&background=111827&color=22d3ee&size=128`);
        }
      } catch (err) { setError('Failed to load profile data.'); } 
      finally { setLoading(false); }
    };
    if (user) { fetchProfile(); } 
    else { setLoading(false); setError('You must be logged in to view this page.'); }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setSubmitSuccess('');
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setSubmitError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    if (selectedFile) formData.append('profileImage', selectedFile);
    if (currentPassword && newPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    } else if (newPassword) {
      setSubmitError("โปรดใส่รหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่านใหม่");
      setIsSubmitting(false);
      return;
    }
    formData.append('bio', bio);
    formData.append('socialLinks', JSON.stringify(socialLinks));

    try {
      const response = await apiClient.put('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitSuccess(response.data.message || 'Profile updated successfully!');
      
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setSelectedFile(null);
      
      const updatedUser = response.data.user;
      if (updatedUser) {
        if (updatedUser.profileImageUrl) {
          setPreview(updatedUser.profileImageUrl);
          updateUserProfile({ profileImageUrl: updatedUser.profileImageUrl });
        }
        setBio(updatedUser.bio || '');
        if(updatedUser.socialLinks && typeof updatedUser.socialLinks === 'object') {
          setSocialLinks(updatedUser.socialLinks);
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-8 text-text-secondary">Loading settings...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">Profile Settings</h1>
          <p className="text-lg text-text-secondary mt-2">Update your profile, social links, and password.</p>
        </div>
      </section>

      <div className="container mx-auto p-8 max-w-6xl">
        <form onSubmit={handleSubmit} className="glass-card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Image & Socials */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-main mb-2">Profile Picture</h3>
                <div className="relative w-40 h-40 rounded-full group mx-auto">
                    <img src={preview} alt="Profile" className="object-cover w-full h-full rounded-full" />
                    <label htmlFor="profileImageUpload" className="absolute inset-0 bg-black/60 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <FaUpload size={40} />
                    <input type="file" id="profileImageUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main mb-2">Social Links</h3>
                <div className="space-y-3">
                  <div className="relative"><FaTwitch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" /><input type="text" name="twitch" value={socialLinks.twitch || ''} onChange={handleSocialChange} className="input-field bg-black/20 pl-10" placeholder="Twitch Username"/></div>
                  <div className="relative"><FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" /><input type="text" name="youtube" value={socialLinks.youtube || ''} onChange={handleSocialChange} className="input-field bg-black/20 pl-10" placeholder="YouTube Channel URL"/></div>
                  <div className="relative"><FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" /><input type="text" name="facebook" value={socialLinks.facebook || ''} onChange={handleSocialChange} className="input-field bg-black/20 pl-10" placeholder="Facebook Profile URL"/></div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Password */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-text-main mb-2">About Me (Bio)</h3>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="textarea-field bg-black/20" rows="5" placeholder="Tell us a little about yourself..."></textarea>
                </div>
                <div className="pt-6 border-t border-white/10">
                    <h3 className="text-xl font-bold text-text-main mb-2">Change Password</h3>
                    <p className="text-sm text-text-secondary mb-4">To change your password, fill all three fields below. To only update your profile, leave these fields blank.</p>
                    <div className="space-y-4">
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
                    </div>
                </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
            {submitSuccess && <p className="text-green-400 text-sm mb-4">{submitSuccess}</p>}
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <FaSave className="mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;