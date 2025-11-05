import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '../home/ProjectCard';
import { mockProjects } from '@/data/mockProjects';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const RelatedCampaigns = ({ category, currentCampaignId, className = '' }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Filter campaigns by category and exclude current campaign
  // Use case-insensitive comparison for flexibility
  const relatedCampaigns = mockProjects.filter(
    (project) => 
      project.category?.toLowerCase() === category?.toLowerCase() && 
      project.id !== currentCampaignId
  );

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
  }, [swiperRef]);

  // If no related campaigns, don't render anything
  if (relatedCampaigns.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300 ${className}`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white transition-colors duration-300">
              Dự án liên quan
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-white mt-1">
              Các chiến dịch khác trong danh mục <span className="font-semibold text-primary">{category}</span>
            </p>
          </div>

          {/* Pagination Controls */}
          {relatedCampaigns.length > 4 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => swiperRef?.slidePrev()}
                className="related-prev p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 active:scale-95 disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => swiperRef?.slideNext()}
                className="related-next p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 active:scale-95 disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          slidesPerGroup={4}
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
            prevEl: '.related-prev',
            nextEl: '.related-next',
          }}
          pagination={{
            clickable: true,
            el: '.related-pagination',
            bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500',
            bulletActiveClass: '!w-8 !bg-primary',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className={`!pb-2 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        >
          {relatedCampaigns.map((campaign) => (
            <SwiperSlide key={campaign.id}>
              <ProjectCard
                project={campaign}
                onBookmarkToggle={(id, bookmarked) => {
                  console.log('Bookmark toggled:', id, bookmarked);
                  // TODO: Implement bookmark logic
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Page Indicators */}
        {relatedCampaigns.length > 4 && (
          <div className="related-pagination flex justify-center gap-2 mt-8"></div>
        )}
      </div>
    </section>
  );
};

export default RelatedCampaigns;
