import React from 'react';
import { FaTwitter, FaFacebook, FaLink } from 'react-icons/fa';

const SocialShare = ({ title }) => {
  const pageUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="flex items-center gap-4">
      <p className="font-semibold text-text-secondary">Share:</p>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-secondary hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <FaTwitter size={20} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-secondary hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <FaFacebook size={20} />
      </a>
      <button
        onClick={copyToClipboard}
        className="text-text-secondary hover:text-white transition-colors"
        aria-label="Copy link"
      >
        <FaLink size={20} />
      </button>
    </div>
  );
};

export default SocialShare;