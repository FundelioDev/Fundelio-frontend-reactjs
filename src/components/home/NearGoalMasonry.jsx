import React, { useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { mockProjects } from '@/data/mockProjects';

export const NearGoalMasonry = ({
  projects = mockProjects,
  title = 'Sắp cán mốc',
}) => {
  // Lọc các dự án có progress 70-95%
  const nearGoalProjects = useMemo(() => {
    const filtered = projects.filter(
      (project) =>
        project.progressPercent >= 70 && project.progressPercent <= 95
    );
    // Sắp xếp theo progressPercent giảm dần để card đầu là cao nhất
    return filtered.sort((a, b) => b.progressPercent - a.progressPercent);
  }, [projects]);

  // Hàm xác định size card theo pattern
  const getCardSize = (index) => {
    const pattern = [
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
    ];
    return pattern[index % pattern.length];
  };

  if (nearGoalProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-hero font-bold text-text-primary dark:text-white mb-4 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-white max-w-2xl transition-colors duration-300">
            Những dự án đang rất gần với mục tiêu. Hãy là người ủng hộ cuối cùng
            giúp họ thành công!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First large card - Desktop: expanded, Mobile/Tablet: default (hover) */}
          <div className="w-full">
            {/* Desktop version - expanded mode */}
            {nearGoalProjects.slice(0, 1).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                mode="expanded"
                className="hidden lg:block"
                onBookmarkToggle={(id, bookmarked) => {
                  console.log('Bookmark toggled:', id, bookmarked);
                  // TODO: Implement bookmark logic
                }}
              />
            ))}
            {/* Mobile/Tablet version - hover to reveal */}
            {nearGoalProjects.slice(0, 1).map((project) => (
              <ProjectCard
                key={`${project.id}-mobile`}
                project={project}
                mode="default"
                className="block lg:hidden"
                onBookmarkToggle={(id, bookmarked) => {
                  console.log('Bookmark toggled:', id, bookmarked);
                  // TODO: Implement bookmark logic
                }}
              />
            ))}
          </div>
          {/* Remaining cards - Mobile: 1 column, Tablet+: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nearGoalProjects.slice(1, 8).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                size={getCardSize(index)}
                onBookmarkToggle={(id, bookmarked) => {
                  console.log('Bookmark toggled:', id, bookmarked);
                  // TODO: Implement bookmark logic
                }}
              />
            ))}
          </div>
        </div>
        {/* View All Button */}
        {nearGoalProjects.length > 8 && (
          <div className="text-center mt-10">
            <a
              href="/projects?filter=near-goal"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Xem tất cả dự án sắp đạt mục tiêu
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearGoalMasonry;
