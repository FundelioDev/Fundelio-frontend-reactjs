import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProjectCard } from '@/components/home/ProjectCard';

const YourProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('backed');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'backed', label: 'Backed' },
    { id: 'followed', label: 'Followed' },
  ];

  // Mock data - replace with actual API call
  const backedProjects = [
    {
      id: 1,
      title: 'Smart Home Hub - The Future of Connected Living',
      authorName: 'Tech Innovations Inc.',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechInc',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      daysLeft: 15,
      progressPercent: 85,
      pledged: 85000000,
      goal: 100000000,
      category: 'Công nghệ',
      status: 'active',
      backerCount: 523,
      likeCount: 1240,
      bookmarked: true,
    },
    {
      id: 2,
      title: 'Eco-Friendly Water Bottle - Save the Planet',
      authorName: 'Green Earth Co.',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GreenEarth',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      daysLeft: 0,
      progressPercent: 84,
      pledged: 42000000,
      goal: 50000000,
      category: 'Sản phẩm',
      status: 'expired',
      backerCount: 320,
      likeCount: 890,
      bookmarked: true,
    },
    {
      id: 3,
      title: 'Indie Game: Chronicles of the Lost Kingdom',
      authorName: 'Pixel Dreams Studio',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelDreams',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop',
      daysLeft: 22,
      progressPercent: 120,
      pledged: 120000000,
      goal: 100000000,
      category: 'Game',
      status: 'active',
      backerCount: 1205,
      likeCount: 3450,
      bookmarked: true,
    },
    {
      id: 4,
      title: 'Documentary: Ocean Conservation',
      authorName: 'Blue Planet Films',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BluePlanet',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      daysLeft: 0,
      progressPercent: 45,
      pledged: 22500000,
      goal: 50000000,
      category: 'Phim',
      status: 'expired',
      backerCount: 156,
      likeCount: 445,
      bookmarked: true,
    },
  ];

  const renderProjects = () => {
    if (activeTab === 'backed' && backedProjects.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="inline-block w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-text-white mb-4">
            There are no projects to show
          </h2>
          <p className="text-muted-foreground dark:text-text-white/70 mb-8 max-w-md mx-auto">
            You can try different filtering criteria to find what you're looking for.
          </p>
          <Link
            to="/home"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            EXPLORE PROJECTS
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {backedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            variant={project.status === 'expired' ? 'expired' : 'default'}
            asLink={`/campaigns/detail?id=${project.id}`}
            onBookmarkToggle={(id, newState) => {
              console.log('Toggle bookmark:', id, newState);
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-20 sm:py-26">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-text-white mb-8">
          Your projects
        </h1>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darker rounded-full border border-border dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors text-sm font-medium text-foreground dark:text-text-white">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darker rounded-full border border-border dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors text-sm font-medium text-foreground dark:text-text-white">
            <ArrowUpDown className="w-4 h-4" />
            Sort: Default
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-border dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-base font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary dark:text-primary-400'
                  : 'text-muted-foreground dark:text-text-white/70 hover:text-foreground dark:hover:text-text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className=" rounded-lg p-8">
          {renderProjects()}
        </div>
      </div>
    </div>
  );
};

export default YourProjectsPage;
