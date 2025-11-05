import React from 'react';
import {
  Clock,
  Rocket,
  ShoppingBag,
  Store,
  Dices,
  Sword,
  Monitor,
  Scissors,
  Gamepad2,
  LayoutGrid
} from 'lucide-react';

const ProjectLists = ({ className = '' }) => {
  const projectLists = [
    { id: 'upcoming', name: 'Sắp ra mắt', icon: Clock, color: 'text-blue-400' },
    { id: 'crowdfunding', name: 'Gây quỹ', icon: Rocket, color: 'text-green-400' },
    { id: 'late-pledge', name: 'Pledge muộn', icon: ShoppingBag, color: 'text-green-400' },
    { id: 'preorders', name: 'Đặt trước & Cửa hàng', icon: Store, color: 'text-green-400' },
  ];

  const categories = [
    { id: 'board-games', name: 'Trò chơi bàn & thẻ', icon: Dices, color: 'text-green-400' },
    { id: 'ttrpg', name: 'TTRPG', icon: Sword, color: 'text-green-400' },
    { id: 'others', name: 'Khác', icon: Monitor, color: 'text-green-400' },
    { id: 'accessories', name: 'Phụ kiện', icon: Scissors, color: 'text-green-400' },
    { id: 'video-games', name: 'Trò chơi điện tử', icon: Gamepad2, color: 'text-green-400' },
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
                <a
                  key={list.id}
                  href={`/projects/${list.id}`}
                  className="flex items-center justify-between p-4 bg-white dark:bg-darker-2 rounded-lg dark:hover:bg-gray-700 shadow-md cursor-pointer transition-all duration-200 group"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">
                    {list.name}
                  </span>
                  <Icon className={`w-5 h-5 ${list.color}`} />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-5">
            <Dices className="w-6 h-6 text-text-primary dark:text-white" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh mục
            </h2>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center justify-between p-4 bg-white dark:bg-darker-2 rounded-lg shadow-md dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <Icon className={`w-5 h-5 ${category.color}`} />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default ProjectLists;
