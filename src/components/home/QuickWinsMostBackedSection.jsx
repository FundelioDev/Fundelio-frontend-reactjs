import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { TbDiamondFilled } from "react-icons/tb";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Hidden Gems Section
 * Hidden Gems: Goal < 50M VND, sorted by progress
 * @param {Array} campaigns - Array of hiddenGems campaigns
 * @param {boolean} loading - Loading state from parent
 */
export const QuickWinsMostBackedSection = ({ campaigns = [], loading = false }) => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [isReady, setIsReady] = useState(false);

    // Enable transitions after mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            if (swiperRef) swiperRef.update();
        }, 100);
        return () => clearTimeout(timer);
    }, [swiperRef]);

    if (loading) {
        return (
            <section className="py-8 sm:py-10 lg:py-12 bg-background-light-2 dark:bg-darker transition-colors duration-300">
                <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Đang tải...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const isEmpty = campaigns.length === 0;

    return (
        <section className="py-8 sm:py-10 lg:py-12 bg-background-light-2 dark:bg-darker transition-colors duration-300">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Title and Navigation */}
                <div className="flex items-center justify-between mb-2">
                    {/* Title */}
                    <div className="flex items-center gap-2">
                        <TbDiamondFilled className="w-6 h-6 sm:w-7 sm:h-7 text-text-primary dark:text-white" />
                        <h2 className="text-xl sm:text-2xl font-medium text-text-primary dark:text-white">
                            Tiềm năng
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">
                            {campaigns.length}
                        </span>
                    </div>

                    {/* Navigation Controls */}
                    {!isEmpty && campaigns.length > 4 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => swiperRef?.slidePrev()}
                                className="hidden-gems-prev p-2 rounded-sm transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => swiperRef?.slideNext()}
                                className="hidden-gems-next p-2 rounded-sm transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Description
                <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400 mt-4 mb-6">
                    💎 Những dự án có mục tiêu gọi vốn thấp (dưới 50 triệu VND), dễ thành công, thường là các dự án cá nhân hoặc indie.
                </p> */}

                {/* Content */}
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-muted-foreground">Chưa có dự án nào trong danh mục này</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Swiper Carousel */}
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            speed={600}
                            loop={false}
                            observer={true}
                            observeParents={true}
                            onSwiper={setSwiperRef}
                            navigation={{
                                prevEl: '.hidden-gems-prev',
                                nextEl: '.hidden-gems-next',
                            }}
                            // pagination={{
                            //     clickable: true,
                            //     el: '.hidden-gems-pagination',
                            //     bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500',
                            //     bulletActiveClass: '!w-8 !bg-primary',
                            // }}
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
                            {campaigns.map((campaign) => (
                                <SwiperSlide key={campaign.campaignId} className="pt-6">
                                    <ProjectCard
                                        project={campaign}
                                        asLink={`/campaigns/${campaign.campaignId}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Pagination Dots */}
                        {/* {campaigns.length > 4 && (
                            <div className="hidden-gems-pagination flex justify-center gap-2 mt-8"></div>
                        )} */}
                        <div className="flex justify-end mt-1">
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                            >
                                <span>Xem thêm chiến dịch</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default QuickWinsMostBackedSection;
