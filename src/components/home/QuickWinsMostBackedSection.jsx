import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Users } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Quick Wins & Most Backed Section - Tabbed
 * Quick Wins: Goal < 10M VND
 * Most Backed: Highest backers count
 * @param {Object} campaigns - Object with quickWins and mostBacked arrays
 * @param {boolean} loading - Loading state from parent
 */
export const QuickWinsMostBackedSection = ({ campaigns = { quickWins: [], mostBacked: [] }, loading = false }) => {
    const [activeTab, setActiveTab] = useState('quick-wins');
    const [swiperRef, setSwiperRef] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const { quickWins: quickWinsCampaigns = [], mostBacked: mostBackedCampaigns = [] } = campaigns;

    const tabs = [
        {
            id: 'quick-wins',
            label: 'Dễ Đạt Mục Tiêu',
            count: quickWinsCampaigns.length,
            icon: Zap,
        },
        {
            id: 'most-backed',
            label: 'Nhiều Người Ủng Hộ',
            count: mostBackedCampaigns.length,
            icon: Users,
        },
    ];

    const getCurrentCampaigns = () => {
        return activeTab === 'quick-wins' ? quickWinsCampaigns : mostBackedCampaigns;
    };

    const currentCampaigns = getCurrentCampaigns();

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsReady(false);
        swiperRef?.slideTo(0);
        setTimeout(() => setIsReady(true), 100);
    };

    // Enable transitions after mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            if (swiperRef) swiperRef.update();
        }, 100);
        return () => clearTimeout(timer);
    }, [swiperRef, activeTab]);

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

    const isEmpty = currentCampaigns.length === 0;

    return (
        <section className="py-8 sm:py-10 lg:py-12 bg-background-light-2 dark:bg-darker transition-colors duration-300">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Tabs and Navigation */}
                <div className="flex items-center justify-between mb-2 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative pb-3 font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'text-text-primary dark:text-white'
                                        : 'text-text-secondary dark:text-text-white hover:text-text-primary dark:hover:text-text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-lg sm:text-2xl">{tab.label}</span>
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

                    {/* Navigation Controls */}
                    {!isEmpty && currentCampaigns.length > 4 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => swiperRef?.slidePrev()}
                                className={`quick-most-prev-${activeTab} p-2 rounded-sm transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card`}
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => swiperRef?.slideNext()}
                                className={`quick-most-next-${activeTab} p-2 rounded-sm transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card`}
                                aria-label="Next"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400 mt-4 mb-6">
                    {activeTab === 'quick-wins'
                        ? '🎯 Những dự án với mục tiêu nhỏ hơn 10 triệu VND, dễ dàng ủng hộ và nhanh chóng thành công!'
                        : '👥 Những dự án có cộng đồng ủng hộ đông đảo nhất, được nhiều người tin tưởng!'}
                </p>

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
                            key={activeTab}
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
                                prevEl: `.quick-most-prev-${activeTab}`,
                                nextEl: `.quick-most-next-${activeTab}`,
                            }}
                            pagination={{
                                clickable: true,
                                el: `.quick-most-pagination-${activeTab}`,
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
                                <SwiperSlide key={campaign.campaignId} className="pt-6">
                                    <ProjectCard
                                        project={campaign}
                                        asLink={`/campaigns/${campaign.campaignId}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Page Indicators */}
                        {currentCampaigns.length > 4 && (
                            <div className={`quick-most-pagination-${activeTab} flex justify-center gap-2 mt-8`}></div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default QuickWinsMostBackedSection;
