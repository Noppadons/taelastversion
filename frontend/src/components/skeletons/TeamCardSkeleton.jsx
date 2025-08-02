// frontend/src/components/skeletons/TeamCardSkeleton.jsx

import React from 'react';

const TeamCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* Placeholder for Image */}
      <div className="w-full h-48 bg-gray-700 animate-pulse"></div>

      <div className="p-6">
        {/* Placeholder for Title */}
        <div className="h-8 w-3/4 mb-4 bg-gray-700 rounded animate-pulse"></div>

        {/* Placeholder for Description */}
        <div className="h-4 w-full mb-2 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 mb-4 bg-gray-700 rounded animate-pulse"></div>

        {/* Placeholder for Game Tag */}
        <div className="flex justify-end">
          <div className="h-6 w-1/4 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TeamCardSkeleton;