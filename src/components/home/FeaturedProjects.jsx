// import React from 'react';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '../ui/carousel';
// import ProjectCard from '../ProjectCard';
// import { mockProjects } from '@/data/mockProjects';
// import Autoplay from 'embla-carousel-autoplay';

// export const FeaturedProjects = ({
//   projects = mockProjects.slice(0, 6),
//   title = 'Dự án nổi bật',
// }) => {
//   const autoplayPlugin = React.useRef(
//     Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
//   );

//   return (
//     <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-darker transition-colors duration-300">
//       <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="flex items-center justify-between mb-10 sm:mb-12">
//           <div>
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-white mb-2 transition-colors duration-300">
//               {title}
//             </h2>
//             <p className="text-lg text-text-secondary dark:text-text-white transition-colors duration-300">
//               Những dự án được lựa chọn đặc biệt từ cộng đồng
//             </p>
//           </div>
//           <a
//             href="/projects?featured=true"
//             className="hidden sm:inline-flex items-center gap-2 text-primary dark:text-primary-400 font-semibold hover:gap-3 transition-all duration-300"
//           >
//             Xem tất cả
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </a>
//         </div>

//         {/* Carousel */}
//         <Carousel
//           opts={{
//             align: 'start',
//             loop: true,
//           }}
//           plugins={[autoplayPlugin.current]}
//           className="w-full"
//           onMouseEnter={() => autoplayPlugin.current.stop()}
//           onMouseLeave={() => autoplayPlugin.current.play()}
//         >
//           <CarouselContent className="-ml-4">
//             {projects.map((project) => (
//               <CarouselItem
//                 key={project.id}
//                 className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
//               >
//                 <ProjectCard
//                   project={project}
//                   onBookmarkToggle={(id, bookmarked) => {
//                     console.log('Bookmark toggled:', id, bookmarked);
//                     // TODO: Implement bookmark logic
//                   }}
//                 />
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <div className="hidden sm:block">
//             <CarouselPrevious className="left-0 -translate-x-1/2" />
//             <CarouselNext className="right-0 translate-x-1/2" />
//           </div>
//         </Carousel>

//         {/* Mobile View All Button */}
//         <div className="sm:hidden text-center mt-8">
//           <a
//             href="/projects?featured=true"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300"
//           >
//             Xem tất cả dự án nổi bật
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProjects;
