import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectLists from './ProjectLists';
import { mockProjects } from '@/data/mockProjects';

export const FeaturedSpotlight = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // 2x2 grid

  // Mock data cho Featured (lấy 8 dự án đầu)
  const featuredCampaigns = mockProjects.slice(0, 8);
  
  // Mock data cho Spotlight (lấy từ project 11-20 có featured flag)
  const spotlightCampaigns = mockProjects.slice(10, 20);
  
  const totalPages = Math.ceil(featuredCampaigns.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return featuredCampaigns.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const formatTimeAgo = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} phút trước`;
    if (hours < 24) return `${Math.round(hours)} giờ trước`;
    return `${Math.round(hours / 24)} ngày trước`;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: Project Lists & Categories */}
          <ProjectLists className="hidden lg:block" />

          {/* Main Content Area */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Center: Featured Projects (2x2 Grid) */}
            <div className="xl:col-span-8">
              {/* Header with Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Featured
                  </h2>
                </div>

                {/* Navigation Buttons */}
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
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {getCurrentPageItems().map((campaign) => (
                  <ProjectCard
                    key={campaign.id}
                    project={campaign}
                    asLink={`/campaigns/detail`}
                    onBookmarkToggle={(id, bookmarked) => {
                      console.log('Bookmark toggled:', id, bookmarked);
                    }}
                  />
                ))}
              </div>

              {/* Page Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentPage
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Spotlight */}
            <div className="xl:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 text-text-primary dark:text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Spotlight
                </h2>
              </div>

              {/* Scrollable List with Fade Effect */}
              <div className="relative">
                {/* Scrollable Container */}
                <div 
                  className="space-y-2 overflow-y-auto pr-2 scrollbar-primary"
                  style={{ 
                    maxHeight: 'calc(2 * 400px + 1.5rem)', // Height of 2 cards + gap
                    minHeight: 'calc(2 * 400px + 1.5rem)',
                  }}
                >
                  {spotlightCampaigns.map((campaign, index) => (
                    <a 
                      key={campaign.id}
                      href={`/campaign/${campaign.id}`}
                      className="flex items-center gap-2 p-3 bg-white dark:bg-darker rounded-lg hover:scale-[1.02] transition-all duration-200 group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-15 h-15 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={campaign.imageUrl || '/placeholder.svg'}
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {campaign.daysLeft <= 2 && (
                          <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            FINAL DAYS
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(campaign.hoursAgo || Math.random() * 24)}
                          </span>
                          <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold whitespace-nowrap">
                            {campaign.daysLeft * 24} HOURS LEFT
                          </span>
                        </div>

                        {/* Progress indicator */}
                        {campaign.progressPercent >= 100 && (
                          <div className="">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                CAMPAIGN IS FUNDED
                              </span>
                            </div>
                          </div>
                        )}
                        <h3 className="text-xs font-bold text-text-primary dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                          {campaign.title}
                        </h3>
                        
                        {/* <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          {campaign.description?.slice(0, 50) || `by ${campaign.authorName}`}
                        </p> */}
                      </div>
                    </a>
                  ))}
                </div>

                {/* Bottom Fade Overlay - chỉ hiện khi có scrollbar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpotlight;
