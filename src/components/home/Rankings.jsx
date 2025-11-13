import React, { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Users, ChevronDown } from 'lucide-react';
import RankingItem from './RankingItem';
import { mockProjects } from '@/data/mockProjects';

export const Rankings = ({
  projects = mockProjects,
  title = 'Xếp hạng',
}) => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAllFunding, setShowAllFunding] = useState(false);
  const [showAllAudience, setShowAllAudience] = useState(false);

  // Get top 10 by funding
  const topByFunding = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.pledged - a.pledged)
      .slice(0, 10);
  }, [projects]);

  // Get top 10 by audience (backers)
  const topByAudience = useMemo(() => {
    return [...projects]
      .sort((a, b) => (b.backerCount || 0) - (a.backerCount || 0))
      .slice(0, 10);
  }, [projects]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              <option value="24h">24 giờ qua</option>
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="all">Tất cả thời gian</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="game">Trò chơi</option>
              <option value="tech">Công nghệ</option>
              <option value="art">Nghệ thuật</option>
              <option value="music">Âm nhạc</option>
            </select>
          </div>
        </div>

        {/* Two Tables Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* By Funding Table */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Theo số tiền gây quỹ</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              {topByFunding.slice(0, showAllFunding ? 10 : window.innerWidth < 1024 ? 3 : 10).map((project, index) => (
                <RankingItem
                  key={project.id}
                  rank={index + 1}
                  project={project}
                  type="funding"
                  isFirst={index === 0}
                  isLast={index === (showAllFunding ? topByFunding.length - 1 : window.innerWidth < 1024 ? 2 : topByFunding.length - 1)}
                />
              ))}
              {/* Show More Button - Only on Mobile */}
              {!showAllFunding && topByFunding.length > 3 && (
                <button
                  onClick={() => setShowAllFunding(true)}
                  className="lg:hidden w-full py-3 text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Xem thêm</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* By Audience Table */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Theo số lượng người ủng hộ</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              {topByAudience.slice(0, showAllAudience ? 10 : window.innerWidth < 1024 ? 3 : 10).map((project, index) => (
                <RankingItem
                  key={project.id}
                  rank={index + 1}
                  project={project}
                  type="audience"
                  isFirst={index === 0}
                  isLast={index === (showAllAudience ? topByAudience.length - 1 : window.innerWidth < 1024 ? 2 : topByAudience.length - 1)}
                />
              ))}
              {/* Show More Button - Only on Mobile */}
              {!showAllAudience && topByAudience.length > 3 && (
                <button
                  onClick={() => setShowAllAudience(true)}
                  className="lg:hidden w-full py-3 text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Xem thêm</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rankings;
