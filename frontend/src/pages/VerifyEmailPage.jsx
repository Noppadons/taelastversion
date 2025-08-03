import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const verifyToken = async () => {
        try {
          // ส่ง token ไปให้ backend
          await apiClient.get(`/auth/verify?token=${token}`);
          setVerificationStatus('Success');
        } catch (error) {
          setVerificationStatus('Error');
        }
      };
      verifyToken();
    } else {
      setVerificationStatus('Missing Token');
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'Success':
        return {
          title: 'Verification Successful!',
          message: 'Your email has been verified. You can now log in to your account.',
          isSuccess: true,
        };
      case 'Error':
        return {
          title: 'Verification Failed',
          message: 'The verification link is invalid or has expired. Please try registering again.',
          isSuccess: false,
        };
      case 'Missing Token':
         return {
          title: 'Verification Failed',
          message: 'No verification token was found. Please use the link sent to your email.',
          isSuccess: false,
        };
      default:
        return {
          title: 'Verifying Your Email...',
          message: 'Please wait a moment.',
          isSuccess: null,
        };
    }
  };

  const { title, message, isSuccess } = renderContent();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2022/04/24/17/57/e-sports-7154316_1280.jpg')` }}
    >
      <div className="absolute inset-0 bg-background opacity-50 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md text-center">
        <div className="glass-card p-8 md:p-12 space-y-6">
          <h1 className="text-3xl font-bold text-text-main">{title}</h1>
          <p className="text-text-secondary">{message}</p>
          {isSuccess && (
            <Link to="/login" className="btn-primary w-full mt-4">
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;