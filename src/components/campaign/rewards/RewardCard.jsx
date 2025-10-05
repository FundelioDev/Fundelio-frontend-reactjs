import React from 'react';
import Button from '@/components/common/Button';

/**
 * RewardCard Component
 * Displays a single reward option with Kickstarter-style UI
 */
const RewardCard = ({ reward, onPledge }) => {
  const {
    title,
    priceLabel,
    description,
    coverUrl,
    backers = 0,
    shipsTo,
    eta,
    itemsIncluded = 0,
    thumbnails = [],
    addOnCount = 0,
    detailsHref = '#',
    pledgeActionLabel,
  } = reward;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* Cover Image */}
      {coverUrl && (
        <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
          <img
            src={coverUrl}
            alt={`${title} cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Header - Title & Price */}
      <div className="flex items-start justify-between bg-background p-4 border-b border-border gap-3">
        <h3 className="text-base font-semibold text-text-secondary dark:text-text-white flex-1">
          {title}
        </h3>
        <div className="text-base font-semibold text-foreground whitespace-nowrap">
          {priceLabel}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="text-sm text-secondary whitespace-pre-line p-4 pt-3">
          {description}
        </div>
      )}

      {/* Meta Information Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4 text-sm">
        <div>
          <div className="text-text-secondary dark:text-text-white font-medium mb-1">Backers</div>
          <div className="text-foreground font-semibold">{backers}</div>
        </div>
        <div>
          <div className="text-text-secondary dark:text-text-white font-medium mb-1">Ships to</div>
          <div className="text-foreground text-xs">{shipsTo}</div>
        </div>
        <div className="col-span-2">
          <div className="text-text-secondary dark:text-text-white font-medium mb-1">
            Estimated delivery
          </div>
          <div className="text-foreground">{eta}</div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {thumbnails.length > 0 && (
        <div className="flex gap-2 px-4 pb-4">
          {thumbnails.slice(0, 4).map((thumb, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded overflow-hidden border border-border bg-muted flex-shrink-0"
            >
              <img
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Items Included */}
      {itemsIncluded > 0 && (
        <div className="px-4 pb-4 text-sm text-text-secondary dark:text-text-white">
          <span className="font-medium">{itemsIncluded} items</span> included
          {addOnCount > 0 && (
            <span className="ml-1">
              +{' '}
              <span className="text-primary">
                {addOnCount} optional add-ons
              </span>
            </span>
          )}
        </div>
      )}

      {/* Footer - Actions */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex gap-3">
          <Button
            variant="white"
            size="md"
            className="flex-1"
            onClick={() => window.open(detailsHref, '_blank')}
            aria-label={`View details for ${title}`}
          >
            Details
          </Button>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onPledge(reward)}
        >
          {pledgeActionLabel || `Pledge ${priceLabel}`}
        </Button>
      </div>
    </div>
  );
};

export default RewardCard;
