import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Rocket,
  Flag,
  Trophy,
  LayoutGrid
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

const ProjectLists = ({ className = '' }) => {
  const { categories, loading: loadingCategories } = useCategories();

  const buildSearchUrl = (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) {
      searchParams.set('status', params.status);
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }
    if (params.category) {
      searchParams.set('category', params.category);
    }
    const query = searchParams.toString();
    return `/search${query ? `?${query}` : ''}`;
  };

  const projectLists = [
    {
      id: 'fundraising',
      name: 'Đang gây quỹ',
      icon: Rocket,
      color: 'text-primary',
      filters: { status: 'all' },
    },
    {
      id: 'new_launches',
      name: 'Mới ra mắt',
      icon: Clock,
      color: 'text-amber-300',
      filters: { status: 'all', sort: 'startDate_desc' },
    },
    {
      id: 'needs_support',
      name: 'Cần tiếp sức',
      icon: Flag,
      color: 'text-slate-300',
      filters: { status: 'active', sort: 'needs_support' },
    },
    {
      id: 'most_funded',
      name: 'Nhiều ủng hộ nhất',
      icon: Trophy,
      color: 'text-emerald-300',
      filters: { status: 'all', sort: 'backersCount' },
    },
  ];

  return (
    <aside className={`w-full lg:w-80 flex-shrink-0 ${className}`}>
      <div className="sticky top-24 space-y-9">
        {/* Project Lists Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-5">
            <LayoutGrid className="w-6 h-6 text-text-primary dark:text-white" />
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
              Danh sách dự án
            </h2>
          </div>

          <nav className="space-y-2">
            {projectLists.map((list) => {
              const Icon = list.icon;
              return (
                <Link
                  key={list.id}
                  to={buildSearchUrl(list.filters)}
                  className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-darker-2 rounded-lg dark:hover:bg-gray-700 shadow-md cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">
                      {list.name}
                    </p>
                  </div>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${list.color}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-5">
            <LayoutGrid className="w-6 h-6 text-text-primary dark:text-white" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh mục
            </h2>
          </div>

          <nav className="space-y-2">
            {loadingCategories ? (
              <div className="p-4 bg-white dark:bg-darker-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Đang tải danh mục...
                </p>
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={buildSearchUrl({ category: category.id })}
                    className="flex items-center justify-between p-4 bg-white dark:bg-darker-2 rounded-lg shadow-md dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                    <IconComponent className={`w-5 h-5 ${category.color}`} />
                  </Link>
                );
              })
            ) : (
              <div className="p-4 bg-white dark:bg-darker-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không có danh mục
                </p>
              </div>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default ProjectLists;
