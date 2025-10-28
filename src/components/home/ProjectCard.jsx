'use client';
import { Clock, Bookmark, Heart, Users } from 'lucide-react';

export const ProjectCard = ({
  project,
  onBookmarkToggle,
  className = '',
  asLink,
  size = 'default',
  mode = 'default',
}) => {
  const {
    id,
    title,
    authorName,
    authorAvatarUrl,
    imageUrl,
    daysLeft,
    progressPercent,
    pledged,
    goal,
    description,
    category,
    location,
    bookmarked = false,
    backerCount = 0,
    likeCount = 0,
  } = project;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, !bookmarked);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const CardContent = () => (
    <article
      role="article"
      className={`
        group relative bg-white dark:bg-[#2a2d3a] overflow-hidden
        transition-all duration-300 ease-out
        hover:-translate-y-2
        hover:shadow-[0_8px_24px_4px_rgba(25,90,254,0.35)]
        break-inside-avoid mb-6 rounded-lg
        ${className}
      `}
    >
      {/* Image Container - Square aspect ratio */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={`Cover image for ${title} project`}
          className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-105"
          style={{ willChange: 'transform' }}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Stats Overlay - Bottom Left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white z-10">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Heart className="w-4 h-4 fill-white" />
            <span className="text-sm font-semibold">{formatNumber(likeCount || 22700)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{formatNumber(backerCount || 8700)}</span>
          </div>
        </div>

        {/* Bookmark Button - Top Right */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full
                    hover:bg-white hover:scale-110 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${bookmarked ? 'fill-primary text-primary' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 bg-white dark:bg-[#2a2d3a]">
        {/* Category Tag & Days Left */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-semibold rounded-full">
            {category || 'Crowdfunding'}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysLeft} ngày
          </span>
        </div>

        {/* Title */}
        <h3 className="text-text-primary dark:text-white text-base md:text-lg font-bold leading-tight line-clamp-2 min-h-[2.8rem]">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2">
          <img
            src={authorAvatarUrl || '/api/placeholder/32/32'}
            alt={`${authorName}'s avatar`}
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text-secondary dark:text-gray-400">by</p>
            <p className="text-text-primary dark:text-white text-sm font-medium truncate">{authorName}</p>
          </div>
        </div>

        {/* Total Funding & Circular Progress */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-3">
            {/* Total Funding */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total funding</p>
              <p className="text-xl md:text-2xl font-bold text-primary dark:text-primary truncate">
                {formatCurrency(pledged)}
              </p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle with Gradient */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#circularGradient)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(progressPercent, 100) / 100)}`}
                  className="transition-all duration-500"
                />
                {/* Gradient Definition - Using gradient-3 colors */}
                <defs>
                  <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'hsl(228, 99%, 55%)' }} />
                    <stop offset="50%" style={{ stopColor: 'hsl(161, 73%, 45%)' }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(161, 73%, 45%)' }} />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-base text-text-primary dark:text-white">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  // Wrap with link if asLink is provided
  if (asLink) {
    return (
      <a href={asLink} className="block">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};

export default ProjectCard;
