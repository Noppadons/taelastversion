import React from 'react';

const TeamCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-48 bg-background/50 animate-pulse"></div>
      <div className="p-6">
        <div className="h-8 w-3/4 mb-4 bg-background/50 rounded animate-pulse"></div>
        <div className="h-4 w-full mb-2 bg-background/50 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 mb-4 bg-background/50 rounded animate-pulse"></div>
        <div className="flex justify-end">
          <div className="h-6 w-1/4 bg-background/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TeamCardSkeleton;