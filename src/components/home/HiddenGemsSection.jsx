// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Gem, Sparkles } from 'lucide-react';
// import ProjectCard from './ProjectCard';
// import { useCampaigns } from '@/hooks/useCampaigns';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// /**
//  * Hidden Gems Section - Quality campaigns with low visibility
//  * Ngọc ẩn: 20-60% progress, < 50 backers
//  */
// export const HiddenGemsSection = () => {
//     const [swiperRef, setSwiperRef] = useState(null);
//     const [isReady, setIsReady] = useState(false);
//     const [filteredCampaigns, setFilteredCampaigns] = useState([]);

//     // Fetch ACTIVE campaigns
//     const { campaigns, loading } = useCampaigns({
//         filter: "campaignStatus:'ACTIVE'",
//         page: 1,
//         size: 100,
//         sort: 'createdAt,desc',
//     });

//     // Filter hidden gems: 20-60% progress, < 50 backers
//     useEffect(() => {
//         const hiddenGems = campaigns.filter((c) => {
//             const progress = (c.pledgedAmount / c.goalAmount) * 100;
//             return progress >= 20 && progress < 60 && c.backersCount < 50;
//         }).sort((a, b) => {
//             const progressA = (a.pledgedAmount / a.goalAmount) * 100;
//             const progressB = (b.pledgedAmount / b.goalAmount) * 100;
//             return progressB - progressA;
//         }).slice(0, 12);

//         setFilteredCampaigns(hiddenGems);
//     }, [campaigns]);

//     // Enable transitions after mount
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setIsReady(true);
//             if (swiperRef) swiperRef.update();
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [swiperRef]);

//     if (loading) {
//         return (
//             <section className="py-8 sm:py-10 lg:py-12 bg-background-lighter-2 dark:bg-darker-2 transition-colors duration-300">
//                 <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-center py-16">
//                         <div className="text-center">
//                             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                             <p className="text-muted-foreground">Đang tải...</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     if (filteredCampaigns.length === 0) return null;

//     return (
//         <section className="py-8 sm:py-10 lg:py-12 bg-background-lighter-2 dark:bg-darker-2 transition-colors duration-300">
//             <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-3">
//                         <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
//                         <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white transition-colors duration-300">
//                             💎 Ngọc Ẩn
//                         </h2>
//                     </div>

//                     {/* Navigation */}
//                     {filteredCampaigns.length > 4 && (
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => swiperRef?.slidePrev()}
//                                 className="hidden-gems-prev p-2 rounded-sm transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card"
//                                 aria-label="Previous"
//                             >
//                                 <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//                             </button>
//                             <button
//                                 onClick={() => swiperRef?.slideNext()}
//                                 className="hidden-gems-next p-2 rounded-sm transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-card"
//                                 aria-label="Next"
//                             >
//                                 <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Description */}
//                 <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400 mb-6">
//                     Những dự án chất lượng nhưng còn ít người biết đến. Hãy khám phá và trở thành người ủng hộ đầu tiên!
//                 </p>

//                 {/* Swiper */}
//                 <Swiper
//                     modules={[Navigation, Pagination]}
//                     spaceBetween={24}
//                     slidesPerView={1}
//                     slidesPerGroup={1}
//                     speed={600}
//                     loop={false}
//                     observer={true}
//                     observeParents={true}
//                     onSwiper={setSwiperRef}
//                     navigation={{
//                         prevEl: '.hidden-gems-prev',
//                         nextEl: '.hidden-gems-next',
//                     }}
//                     pagination={{
//                         clickable: true,
//                         el: '.hidden-gems-pagination',
//                         bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500',
//                         bulletActiveClass: '!w-8 !bg-purple-500',
//                     }}
//                     breakpoints={{
//                         640: {
//                             slidesPerView: 2,
//                             slidesPerGroup: 1,
//                             spaceBetween: 16,
//                         },
//                         1024: {
//                             slidesPerView: 4,
//                             slidesPerGroup: 2,
//                             spaceBetween: 24,
//                         },
//                     }}
//                     className={`!pb-2 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
//                 >
//                     {filteredCampaigns.map((campaign) => (
//                         <SwiperSlide key={campaign.campaignId} className="pt-6">
//                             <ProjectCard
//                                 project={campaign}
//                                 asLink={`/campaigns/${campaign.campaignId}`}
//                             />
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>

//                 {/* Pagination Dots */}
//                 {filteredCampaigns.length > 4 && (
//                     <div className="hidden-gems-pagination flex justify-center gap-2 mt-8"></div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default HiddenGemsSection;
