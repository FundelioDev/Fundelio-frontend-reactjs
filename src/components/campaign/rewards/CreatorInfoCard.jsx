import React from 'react';

/**
 * CreatorInfoCard Component
 * Displays creator information with avatar, name, stats, and bio
 */
const CreatorInfoCard = ({ creator }) => {
  const {
    name = 'Creator Name',
    created = 0,
    backed = 0,
    avatarUrl,
    bio = '',
    moreHref = '#',
  } = creator;

  return (
    <div className="border border-border rounded-sm p-4 bg-white dark:bg-darker-2 shadpw-sm">
      {/* Avatar & Name */}
      <div className="flex items-center gap-3 mb-3">
        {avatarUrl ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-muted flex-shrink-0">
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
            <span className="text-text-secondary text-lg font-medium">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {name}
          </h3>
          <p className="text-xs text-text-secondary dark:text-white">
            {created} đã tạo • {backed} đã ủng hộ
          </p>
        </div>
      </div>

      {/* Bio */}
      {bio && <p className="text-sm text-secondary mb-3 line-clamp-3">{bio}</p>}

      {/* See More Link */}
      <a
        href={moreHref}
        className="text-sm text-primary hover:text-primary-600 font-medium transition-colors"
      >
        Xem thêm →
      </a>
    </div>
  );
};

export default CreatorInfoCard;
