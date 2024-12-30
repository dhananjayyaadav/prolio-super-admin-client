import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PaginationButton = memo(
  ({ onClick, disabled, children, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
      px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
      bg-white border border-gray-300 text-gray-700
      hover:bg-gray-50 hover:border-gray-400
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100
      ${className}
    `}
    >
      {children}
    </button>
  )
);

const Pagination = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
    className = "",
  }) => {
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const maxPages = Math.min(5, totalPages);
      let start = Math.max(1, currentPage - delta);
      let end = Math.min(totalPages, start + maxPages - 1);

      // Adjust start if end is at maximum
      start = Math.max(1, end - maxPages + 1);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    };

    return (
      <div
        className={`mt-4 mb-3 flex flex-col items-center space-y-4 px-4 ${className}`}
      >
        <div className="text-sm text-gray-700">
          <span className="font-medium">Page {currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* First Page - Desktop */}
          <div className="hidden md:flex space-x-2">
            <PaginationButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationButton>
          </div>

          {/* Previous Page */}
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>

          {/* Page Numbers - Desktop */}
          <div className="hidden md:flex space-x-2">
            {getVisiblePages().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${
                  pageNum === currentPage
                    ? "bg-blue-700 text-white border border-blue-100"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              `}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Page */}
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>

          {/* Last Page - Desktop */}
          <div className="hidden md:flex space-x-2">
            <PaginationButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationButton>
          </div>
        </div>

        {/* Mobile Page Select */}
        {totalPages > 1 && (
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            disabled={loading}
            className="md:hidden w-24 px-2 py-1 text-sm border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Page {num}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
);

// PropTypes
PaginationButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Pagination;
