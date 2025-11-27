import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProjectCard from './ProjectCard';
import ProjectLists from './ProjectLists';
import { FaFire } from "react-icons/fa6";
/**
 * @param {Object} campaigns - Object with featured and spotlight arrays
 * @param {boolean} loading - Loading state from parent
 */
export const FeaturedSpotlight = ({ campaigns = { featured: [], spotlight: [] }, loading = false }) => {
  const itemsPerPage = 4; // 2x2 grid
  const [swiperRef, setSwiperRef] = useState(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const { featured: featuredCampaigns = [], spotlight: spotlightCampaigns = [] } = campaigns;

  const chunkedFeatured = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < featuredCampaigns.length; i += itemsPerPage) {
      chunks.push(featuredCampaigns.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [featuredCampaigns, itemsPerPage]);

  const hasMultipleSlides = chunkedFeatured.length > 1;

  const handleSlideChange = useCallback(
    (swiperInstance) => {
      if (!swiperInstance) {
        setCanGoPrev(false);
        setCanGoNext(chunkedFeatured.length > 1);
        return;
      }
      setCanGoPrev(!swiperInstance.isBeginning);
      setCanGoNext(!swiperInstance.isEnd);
    },
    [chunkedFeatured.length]
  );

  useEffect(() => {
    if (!swiperRef) {
      handleSlideChange(null);
      return;
    }

    swiperRef.update();
    if (chunkedFeatured.length > 0) {
      const lastIndex = chunkedFeatured.length - 1;
      if (swiperRef.activeIndex > lastIndex) {
        swiperRef.slideTo(lastIndex);
      }
    }
    handleSlideChange(swiperRef);
  }, [swiperRef, chunkedFeatured.length, handleSlideChange]);

  const handlePrevPage = () => {
    swiperRef?.slidePrev();
  };

  const handleNextPage = () => {
    swiperRef?.slideNext();
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                  <FaFire className="w-6 h-6 text-text-primary dark:text-white" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Nổi bật
                  </h2>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasMultipleSlides || !canGoPrev}
                    className={`p-2 rounded-lg transition-all duration-200 ${hasMultipleSlides && canGoPrev
                      ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasMultipleSlides || !canGoNext}
                    className={`p-2 rounded-lg transition-all duration-200 ${hasMultipleSlides && canGoNext
                      ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 2x2 Grid via Swiper */}
              {chunkedFeatured.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  Chưa có chiến dịch nổi bật để hiển thị.
                </div>
              ) : (
                <Swiper
                  spaceBetween={24}
                  allowTouchMove={hasMultipleSlides}
                  onSwiper={(swiperInstance) => {
                    setSwiperRef(swiperInstance);
                    handleSlideChange(swiperInstance);
                  }}
                  onSlideChange={handleSlideChange}
                >
                  {chunkedFeatured.map((campaignGroup, index) => (
                    <SwiperSlide key={`featured-slide-${index}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {campaignGroup.map((campaign) => (
                          <ProjectCard
                            key={campaign.campaignId}
                            project={campaign}
                            asLink={`/campaigns/${campaign.campaignId}`}
                            onBookmarkToggle={(id, bookmarked) => {
                              console.log('Bookmark toggled:', id, bookmarked);
                            }}
                          />
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Page Indicators */}
              {/* <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentPage
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div> */}
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
                    maxHeight: 'calc(2 * 526px + 1.5rem)', // Height of 2 cards + gap
                    minHeight: 'calc(2 * 526px + 1.5rem)',
                  }}
                >
                  {spotlightCampaigns.map((campaign, index) => {
                    const calculateDaysLeft = (endDate) => {
                      if (!endDate) return 0;
                      const end = new Date(endDate);
                      const now = new Date();
                      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                      return Math.max(0, daysLeft);
                    };

                    const calculateProgress = (pledged, goal) => {
                      if (!goal || goal === 0) return 0;
                      return Math.round((pledged / goal) * 100);
                    };

                    const daysLeft = calculateDaysLeft(campaign.endDate);
                    const progressPercent = calculateProgress(campaign.pledgedAmount, campaign.goalAmount);

                    return (
                      <a
                        key={campaign.campaignId}
                        href={`/campaigns/${campaign.campaignId}`}
                        className="flex items-center gap-2 px-2.5 py-2 bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md rounded-md hover:scale-[1.02] transition-all duration-200 group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <img
                            src={campaign.introImageUrl || '/placeholder.svg'}
                            alt={campaign.title}
                            loading="lazy"
                            decoding="async"
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
                              <span>{campaign.backersCount}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1 font-semibold text-primary">
                              <span>{campaign.pledgedAmount.toLocaleString()} VND</span>
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
