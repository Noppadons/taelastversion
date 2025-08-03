import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="btn-outline !py-2 !px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600"
      >
        &larr; Previous
      </button>

      <span className="text-text-main font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="btn-outline !py-2 !px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600"
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;