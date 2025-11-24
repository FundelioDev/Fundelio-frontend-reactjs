// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import ProjectCard from './ProjectCard';
// import { useCampaigns } from '@/hooks/useCampaigns';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// export const PopularCampaigns = () => {
//   const [swiperRef, setSwiperRef] = useState(null);
//   const [isReady, setIsReady] = useState(false);

//   // Fetch popular campaigns - sorted by backerCount
//   const { campaigns, loading } = useCampaigns({
//     filter: "campaignStatus in ['ACTIVE','SUCCESSFUL']",
//     page: 1,
//     size: 12,
//     sort: 'backersCount,desc', // Sort by popularity (backer count)
//   });

//   // Force layout calculation and enable smooth transitions after mount
//   useEffect(() => {
//     // Small delay to ensure DOM is fully rendered
//     const timer = setTimeout(() => {
//       setIsReady(true);
//       // Force reflow
//       if (swiperRef) {
//         swiperRef.update();
//       }
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [swiperRef]);

//   console.log('Popular campaigns loaded:', campaigns);

//   // Show loading state
//   if (loading) {
//     return (
//       <section className="py-12 sm:py-12 lg:py-18 bg-background-light-2 dark:bg-darker transition-colors duration-300">
//         <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-muted-foreground">Đang tải...</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 sm:py-12 lg:py-18 bg-background-light-2 dark:bg-darker transition-colors duration-300">
//       <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header with Title and Navigation */}
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-2xl sm:text-hero font-bold text-text-primary dark:text-white transition-colors duration-300">
//             Chiến dịch phổ biến
//           </h2>

//           {/* Pagination Controls */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => swiperRef?.slidePrev()}
//               className="popular-prev p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
//               aria-label="Previous page"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             <button
//               onClick={() => swiperRef?.slideNext()}
//               className="popular-next p-2 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary-600 hover:scale-105 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
//               aria-label="Next page"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Swiper Carousel */}
//         <Swiper
//           modules={[Navigation, Pagination, Autoplay]}
//           spaceBetween={24}
//           slidesPerView={1}
//           slidesPerGroup={1}
//           speed={600}
//           loop={false}
//           observer={true}
//           observeParents={true}
//           watchSlidesProgress={true}
//           preloadImages={true}
//           updateOnWindowResize={true}
//           onSwiper={(swiper) => {
//             setSwiperRef(swiper);
//             // Force update after initialization
//             requestAnimationFrame(() => {
//               swiper.update();
//             });
//           }}
//           onInit={(swiper) => {
//             // Ensure smooth transitions from the start
//             swiper.update();
//           }}
//           navigation={{
//             prevEl: '.popular-prev',
//             nextEl: '.popular-next',
//           }}
//           pagination={{
//             clickable: true,
//             el: '.popular-pagination',
//             bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500',
//             bulletActiveClass: '!w-8 !bg-primary',
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 2,
//               slidesPerGroup: 1,
//               spaceBetween: 16,
//             },
//             1024: {
//               slidesPerView: 4,
//               slidesPerGroup: 2,
//               spaceBetween: 24,
//             },
//           }}
//           className={`pb-2 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
//         >
//           {campaigns.map((campaign) => (
//             <SwiperSlide key={campaign.campaignId} className="pt-6">
//               <ProjectCard
//                 project={campaign}
//                 asLink={`/campaigns/${campaign.campaignId}`}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default PopularCampaigns;
