import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { mockProjects } from '@/data/mockProjects';

export const PopularCampaigns = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Sử dụng mock data - có thể thay bằng API call sau
  const campaigns = mockProjects;
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return campaigns.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <section className="py-12 sm:py-12 lg:py-18 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-white transition-colors duration-300">
            Các chiến dịch phổ biến
          </h2>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg transition-all duration-200 ${
                canGoPrev
                  ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-text-secondary dark:text-gray-400 font-medium min-w-[60px] text-center transition-colors duration-300">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-all duration-200 ${
                canGoNext
                  ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid of Campaign Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {getCurrentPageItems().map((campaign) => (
            <ProjectCard
              key={campaign.id}
              project={campaign}
              onBookmarkToggle={(id, bookmarked) => {
                console.log('Bookmark toggled:', id, bookmarked);
                // TODO: Implement bookmark logic
              }}
            />
          ))}
        </div>

        {/* Page Indicators (optional) */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'w-8 bg-primary'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCampaigns;
