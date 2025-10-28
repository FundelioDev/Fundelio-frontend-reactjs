import React from 'react';

const RankingItem = ({ rank, project, type = 'funding', isFirst = false, isLast = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `+${(num / 1000).toFixed(1)}k`;
    return `+${num}`;
  };

  // Medal colors for top 3
  const getMedalClasses = () => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900';
    return 'bg-gray-700 dark:bg-gray-600 text-gray-300';
  };

  // Dynamic classes for first/last items
  const getItemClasses = () => {
    let classes = 'flex items-center gap-4 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group';
    
    if (!isLast) {
      classes += ' border-b border-gray-200 dark:border-gray-700';
    }
    
    return classes;
  };

  return (
    <a
      href={`/campaign/${project.id}`}
      className={getItemClasses()}
    >
      {/* Rank Badge */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getMedalClasses()}`}>
        #{rank}
      </div>

      {/* Project Image */}
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={project.imageUrl || '/placeholder.svg'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {rank === 1 && (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent" />
        )}
      </div>

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          by {project.authorName}
        </p>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {type === 'funding' ? 'FUNDING' : 'AUDIENCE'}
        </div>
        <div className="text-sm font-bold text-gray-900 dark:text-white">
          {type === 'funding' 
            ? formatCurrency(project.pledged) 
            : formatNumber(project.backerCount || 0)
          }
        </div>
      </div>
    </a>
  );
};

export default RankingItem;
