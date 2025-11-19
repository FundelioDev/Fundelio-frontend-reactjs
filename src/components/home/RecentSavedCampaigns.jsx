import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import Button from '../common/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * @param {Object} campaigns - Object with trending and newest arrays
 * @param {boolean} loading - Loading state from parent
 */
export const TrendingNewestCampaigns = ({ campaigns = { trending: [], newest: [] }, loading = false }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [swiperRef, setSwiperRef] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const { trending: trendingCampaigns = [], newest: newestCampaigns = [] } = campaigns;

  const tabs = [
    {
      id: 'trending',
      label: 'Đang xu hướng',
      count: trendingCampaigns.length,
      icon: TrendingUp
    },
    {
      id: 'newest',
      label: 'Mới nhất',
      count: newestCampaigns.length,
      icon: Star
    },
  ];

  const getCurrentCampaigns = () => {
    return activeTab === 'trending' ? trendingCampaigns : newestCampaigns;
  };

  const currentCampaigns = getCurrentCampaigns();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsReady(false);
    swiperRef?.slideTo(0); // Reset to first slide when switching tabs
    // Re-enable after tab switch
    setTimeout(() => setIsReady(true), 100);
  };

  const isEmpty = currentCampaigns.length === 0 && !loading;

  // Force layout calculation and enable smooth transitions after mount
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setIsReady(true);
      // Force reflow
      if (swiperRef) {
        swiperRef.update();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [swiperRef, activeTab]);

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-4">
      <div className="bg-background-lighter dark:bg-darker rounded-full p-6 sm:p-8 mb-6 transition-colors duration-300">
        {activeTab === 'trending' ? (
          <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-text-white" />
        ) : (
          <Star className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-text-white" />
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-3 transition-colors duration-300">
        {activeTab === 'trending' ? 'Chưa có chiến dịch xu hướng' : 'Chưa có chiến dịch mới'}
      </h3>
      <p className="text-text-secondary dark:text-text-white text-center max-w-md mb-6 sm:mb-8 text-sm sm:text-base transition-colors duration-300">
        {activeTab === 'trending'
          ? 'Các chiến dịch đang được quan tâm nhất sẽ xuất hiện ở đây.'
          : 'Các chiến dịch mới nhất sẽ xuất hiện ở đây.'
        }
      </p>
    </div>
  );

  // Loading State Component
  const LoadingState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12 bg-background-light dark:bg-darker-2 transition-colors duration-300">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingState />
        </div>
      </section>
    );
  }

  // Hide section if both tabs are empty
  if (trendingCampaigns.length === 0 && newestCampaigns.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-background-lighter-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Tabs and Pagination */}
        <div className="flex items-center justify-between mb-2 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative pb-4 font-medium transition-all duration-200 ${activeTab === tab.id
                    ? 'text-text-primary dark:text-white'
                    : 'text-text-secondary dark:text-text-white hover:text-text-primary dark:hover:text-text-white'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-xl sm:text-2xl lg:text-3xl">{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-300 ${activeTab === tab.id
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
              );
            })}
          </div>

          {/* Pagination Controls */}
          {!isEmpty && currentCampaigns.length > 4 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => swiperRef?.slidePrev()}
                className={`recent-saved-prev-${activeTab} p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => swiperRef?.slideNext()}
                className={`recent-saved-next-${activeTab} p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Swiper Carousel */}
            <Swiper
              key={activeTab} // Force re-render on tab change
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              speed={600}
              loop={false}
              observer={true}
              observeParents={true}
              watchSlidesProgress={true}
              preloadImages={true}
              updateOnWindowResize={true}
              onSwiper={(swiper) => {
                setSwiperRef(swiper);
                // Force update after initialization
                requestAnimationFrame(() => {
                  swiper.update();
                });
              }}
              onInit={(swiper) => {
                // Ensure smooth transitions from the start
                swiper.update();
              }}
              navigation={{
                prevEl: `.recent-saved-prev-${activeTab}`,
                nextEl: `.recent-saved-next-${activeTab}`,
              }}
              pagination={{
                clickable: true,
                el: `.recent-saved-pagination-${activeTab}`,
                bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500',
                bulletActiveClass: '!w-8 !bg-primary',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  slidesPerGroup: 1,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 4,
                  slidesPerGroup: 2,
                  spaceBetween: 24,
                },
              }}
              className={`!pb-2 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentCampaigns.map((campaign) => (
                <SwiperSlide key={campaign.campaignId} className='pt-6'>
                  <ProjectCard
                    project={campaign}
                    asLink={`/campaigns/${campaign.campaignId}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Page Indicators */}
            {currentCampaigns.length > 4 && (
              <div className={`recent-saved-pagination-${activeTab} flex justify-center gap-2 mt-8`}></div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TrendingNewestCampaigns;
