'use client';
import { Clock, Bookmark, MapPin, Users } from 'lucide-react';

export const ProjectCard = ({
  project,
  onBookmarkToggle,
  className = '',
  asLink,
  size = 'default', // default, tall, wide
  mode = 'default', // default (hover to show), expanded (always show)
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
  } = project;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, !bookmarked);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'tall':
        return 'min-h-[400px]';
      case 'wide':
        return 'min-h-[320px]';
      default:
        return 'min-h-[200px]';
    }
  };

  const CardContent = () => (
    <article
      role="article"
      className={`
        group relative bg-white dark:bg-black overflow-visible
        transition-all duration-300 ease-out
        hover:z-20 hover:shadow-lg
        break-inside-avoid mb-6 rounded-t-lg 
        ${getSizeClasses()}
        ${className}
      `}
    >
      <div
        className={`relative transition-transform duration-300 ${
          mode === 'default' ? 'group-hover:-translate-y-2' : ''
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-md">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Cover image for ${title} project`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200/80 backdrop-blur-sm h-2">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Project progress: ${progressPercent}%`}
            />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full
                      hover:bg-white hover:scale-110 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                bookmarked ? 'fill-primary text-primary' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Main Content - Always Visible */}
        <div className="px-4 pt-2 pb-3 relative z-10 bg-white dark:bg-black">
          {/* Author Info */}
          <div className="flex items-start">
            <img
              src={authorAvatarUrl || '/api/placeholder/32/32'}
              alt={`${authorName}'s avatar`}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary dark:text-text-white line-clamp-2 text-md leading-tight">
                {title}
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-white">
                by {authorName}
              </p>
            </div>
          </div>

          {/* Funding Stats */}
          <div className="mb-0">
            <div className="flex items-center justify-between gap-2 mb-1 text-sm text-primary dark:text-text-white">
              <div className="flex flex-col sm:flex-col">
                {project.startingPrice != null && (
                  <div className="mt-3">
                    <span className="block text-xs text-text-secondary dark:text-text-white">
                      Mức ủng hộ từ
                    </span>
                    <span className="text-xl font-bold text-secondary">
                      {formatCurrency(project.startingPrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-text-secondary dark:text-text-white">
              <span>
                <span className="text-sm font-medium text-text-primary dark:text-text-white">
                  {progressPercent}%
                </span>{' '}
                đã huy động
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Còn {daysLeft} ngày
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Details - Show on hover (default) or always (expanded mode) */}
        <div
          className={`absolute left-0 right-0 top-full bg-white dark:bg-black rounded-b-xl z-30 transition-all duration-100 ease-out ${
            mode === 'expanded'
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 shadow-lg invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
          }`}
        >
          <div className="px-4 pb-4">
            {/* Description */}
            {description && (
              <p className="text-sm text-text-secondary dark:text-text-white line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {category}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-black/10 text-text-primary dark:text-text-white border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                </span>
              )}
            </div>

            {/* Progress Detail */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-primary dark:text-text-white mb-1 transition-colors duration-300">
                <span>Tiến độ</span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(pledged)}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-white">
                  / {formatCurrency(goal)}
                </span>
              </div>
              <div className="w-full bg-background-light dark:bg-gray-600 rounded-full h-1.5 transition-colors duration-300">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
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
