
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Calculate the range of pages to show
  const getPageRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageRange = getPageRange();

  return (
    <nav className={`flex items-center justify-center space-x-1 sm:space-x-2 ${className}`} aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${currentPage === 1
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 border border-gray-200 hover:border-red-300 hover:shadow-md'
          }
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {pageRange.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const isCurrentPage = page === currentPage;
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium rounded-lg transition-all duration-200
                ${isCurrentPage
                  ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 border border-gray-200 hover:border-red-300 hover:shadow-md'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                transform hover:scale-105 active:scale-95
              `}
              aria-label={`Go to page ${page}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${currentPage === totalPages
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 border border-gray-200 hover:border-red-300 hover:shadow-md'
          }
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>

      {/* Page Info - Mobile Only */}
      <div className="sm:hidden ml-4 text-sm text-gray-500 font-medium">
        {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;
