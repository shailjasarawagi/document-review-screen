import React, { memo, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FileText,
} from "lucide-react";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  fieldsPerPage: Record<number, number>;
  isLoading?: boolean;
}

export const PageNavigation = memo<PageNavigationProps>(
  ({
    currentPage,
    totalPages,
    onPageChange,
    fieldsPerPage,
    isLoading = false,
  }) => {
    const visiblePages = useMemo(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900 dark:text-gray-100" />
            </button>

            <div className="flex items-center space-x-1">
              {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span
                      className="px-2 py-1 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to next page"
            >
              <ChevronRight className="w-4 h-4 text-gray-900 dark:text-gray-100" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="page-jump"
              className="text-sm text-gray-900 dark:text-gray-100"
            >
              Go to:
            </label>
            <input
              id="page-jump"
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number.parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="w-16 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
              {fieldsPerPage[currentPage] || 0} fields on page
            </span>
          </div>
        </div>
      </div>
    );
  }
);

PageNavigation.displayName = "PageNavigation";
