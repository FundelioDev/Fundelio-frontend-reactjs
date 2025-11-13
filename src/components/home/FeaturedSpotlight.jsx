import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Users, DollarSign } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectLists from './ProjectLists';
import { mockProjects } from '@/data/mockProjects';
import { mockCampaigns } from '@/data/mockCampaigns';

export const FeaturedSpotlight = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // 2x2 grid

  // Mock data cho Featured (lấy 8 dự án đầu)
  const featuredCampaigns = mockProjects.slice(0, 8);
  
  // Mock data cho Spotlight - Sử dụng mockCampaigns cho các dự án gần đây
  const spotlightCampaigns = mockCampaigns;
  
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

  const formatTimeAgo = (dateString) => {
    const startDate = new Date(dateString);
    const now = new Date();
    const hoursDiff = Math.abs(now - startDate) / 36e5; // Convert milliseconds to hours
    
    if (hoursDiff < 1) return `${Math.round(hoursDiff * 60)} phút trước`;
    if (hoursDiff < 24) return `${Math.round(hoursDiff)} giờ trước`;
    return `${Math.round(hoursDiff / 24)} ngày trước`;
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const calculateProgress = (pledged, goal) => {
    return Math.round((pledged / goal) * 100);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: Project Lists & Categories */}
          <ProjectLists className="hidden lg:block" />

          {/* Main Content Area */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Center: Featured Projects (2x2 Grid) */}
            <div className="xl:col-span-8">
              {/* Header with Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-text-primary dark:text-white" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Nổi bật
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
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                  Gần đây
                </h2>
              </div>

              {/* Scrollable List with Fade Effect */}
              <div className="relative">
                {/* Scrollable Container */}
                <div 
                  className="space-y-2 overflow-y-auto pr-2 pl-2 scrollbar-primary"
                  style={{ 
                    maxHeight: 'calc(2 * 595px + 1.5rem)', // Height of 2 cards + gap
                    minHeight: 'calc(2 * 595px + 1.5rem)',
                  }}
                >
                  {spotlightCampaigns.map((campaign, index) => {
                    const daysLeft = calculateDaysLeft(campaign.end_date);
                    const progressPercent = calculateProgress(campaign.pledged_amount, campaign.goal_amount);
                    
                    return (
                      <a 
                        key={campaign.campaign_id}
                        href={`/campaigns/detail`}
                        className="flex items-center gap-2 px-2.5 py-2 bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md rounded-md hover:scale-[1.02] transition-all duration-200 group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <img
                            src={campaign.heroImageUrl || '/placeholder.svg'}
                            alt={campaign.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold whitespace-nowrap">
                              Còn {daysLeft} ngày
                            </span>
                            {/* Progress indicator */}
                            {progressPercent >= 100 && (
                              <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                                {progressPercent}%
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xs font-bold text-text-primary dark:text-white line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {campaign.title}
                          </h3>
                          
                          {/* Campaign stats with icons */}
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{campaign.backers_count}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1 font-semibold text-primary">
                              <DollarSign className="w-3 h-3" />
                              <span>{campaign.pledged_amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Bottom Fade Overlay - chỉ hiện khi có scrollbar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-gray-50 dark:from-darker to-transparent pointer-events-none"
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
