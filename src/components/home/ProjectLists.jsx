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
    { id: 'upcoming', name: 'Upcoming', icon: Clock, color: 'text-blue-400' },
    { id: 'crowdfunding', name: 'Crowdfunding', icon: Rocket, color: 'text-green-400' },
    { id: 'late-pledge', name: 'Late Pledge', icon: ShoppingBag, color: 'text-green-400' },
    { id: 'preorders', name: 'Preorders & Stores', icon: Store, color: 'text-green-400' },
  ];

  const categories = [
    { id: 'board-games', name: 'Board & card games', icon: Dices, color: 'text-green-400' },
    { id: 'ttrpg', name: 'TTRPG', icon: Sword, color: 'text-green-400' },
    { id: 'others', name: 'Others', icon: Monitor, color: 'text-green-400' },
    { id: 'accessories', name: 'Accessories', icon: Scissors, color: 'text-green-400' },
    { id: 'video-games', name: 'Video Games', icon: Gamepad2, color: 'text-green-400' },
  ];

  return (
    <aside className={`w-full lg:w-80 flex-shrink-0 ${className}`}>
      <div className="sticky top-24 space-y-9">
        {/* Project Lists Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-5">
            <LayoutGrid className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Project lists
            </h2>
          </div>

          <nav className="space-y-2">
            {projectLists.map((list) => {
              const Icon = list.icon;
              return (
                <a
                  key={list.id}
                  href={`/projects/${list.id}`}
                  className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
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
            <Dices className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Category
            </h2>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
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
