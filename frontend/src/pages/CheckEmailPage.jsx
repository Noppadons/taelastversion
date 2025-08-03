import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const CheckEmailPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2022/04/24/17/57/e-sports-7154316_1280.jpg')` }}
    >
      <div className="absolute inset-0 bg-background opacity-50 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md text-center">
        <div className="glass-card p-8 md:p-12 space-y-6">
          <FaEnvelopeOpenText size={64} className="mx-auto text-accent" />
          <h1 className="text-3xl font-bold text-text-main">Check Your Email</h1>
          <p className="text-text-secondary">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;