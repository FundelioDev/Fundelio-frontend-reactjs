import React, { useState } from 'react';
import { Bookmark, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import Button from '../common/Button';
import { mockProjects } from '@/data/mockProjects';

export const RecentSavedCampaigns = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Mock data - có thể thay bằng API call sau
  const recentCampaigns = mockProjects.slice(0, 8);
  const savedCampaigns = mockProjects.filter((p) => p.bookmarked);

  const tabs = [
    { id: 'recent', label: 'Recent', count: recentCampaigns.length },
    { id: 'saved', label: 'Saved', count: savedCampaigns.length },
  ];

  const getCurrentCampaigns = () => {
    return activeTab === 'recent' ? recentCampaigns : savedCampaigns;
  };

  const currentCampaigns = getCurrentCampaigns();
  const totalPages = Math.ceil(currentCampaigns.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentCampaigns.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0); // Reset to first page when switching tabs
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;
  const paginatedCampaigns = getCurrentPageItems();
  const isEmpty = paginatedCampaigns.length === 0;

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-4">
      <div className="bg-background-lighter dark:bg-darker rounded-full p-6 sm:p-8 mb-6 transition-colors duration-300">
        <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-white mb-3 transition-colors duration-300">
        No Saved Campaigns Yet
      </h3>
      <p className="text-text-secondary dark:text-gray-400 text-center max-w-md mb-6 sm:mb-8 text-sm sm:text-base transition-colors duration-300">
        Start exploring and bookmark campaigns you're interested in. They'll
        appear here for easy access.
      </p>
      <Button variant="primary" size="lg" className="gap-2">
        <Compass className="w-5 h-5" />
        Explore All Campaigns
      </Button>
    </div>
  );

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-background-lighter-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Tabs and Pagination */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative pb-4 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-text-primary dark:text-text-white'
                    : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl">{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-gray-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>

                {/* Active Tab Indicator */}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          {!isEmpty && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!canGoPrev}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  canGoPrev
                    ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
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
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedCampaigns.map((campaign) => (
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
        )}

        {/* Page Indicators */}
        {!isEmpty && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'w-8 bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentSavedCampaigns;
