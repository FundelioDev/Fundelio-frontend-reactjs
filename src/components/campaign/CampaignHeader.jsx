import React from 'react';
import Button from '@/components/common/Button';

/**
 * Format currency with locale-specific formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'HKD', 'USD')
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Clamp percentage between 0 and 100
 * @param {number} value - The percentage value
 * @returns {number} Clamped value
 */
const clampPercent = (value) => {
  return Math.min(100, Math.max(0, Math.floor(value)));
};

/**
 * CampaignHeader Component
 * Displays the campaign hero section with image, details, and call-to-action buttons
 */
const CampaignHeader = ({
  campaign = {},
  onPickPerk = () => {},
  onSave = () => {},
  onShare = () => {},
}) => {
  const {
    title = 'Campaign Title',
    highlights = [],
    creator = { name: 'Creator Name', location: 'Location', link: '#' },
    imageUrl = '/images/campaign-hero.jpg',
    currency = 'HKD',
    pledged = 0,
    goal = 1,
    backers = 0,
    daysLeft = 0,
  } = campaign;

  // Calculate progress percentage
  const progressPercent = clampPercent((pledged / goal) * 100);

  // Format numbers
  const formattedPledged = formatCurrency(pledged, currency);
  const formattedGoal = formatCurrency(goal, currency);

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 lg:gap-8">
        {/* Left Column - Campaign Image */}
        <div className="aspect-video overflow-hidden border border-border bg-muted">
          <img
            src={imageUrl}
            alt={`Campaign image for ${title}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Right Column - Campaign Details */}
        <div className="">
          {/* Campaign Title */}
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-3">
            {title}
          </h1>

          {/* Campaign Highlights */}
          <p className="line-clamp-3 text-md text-secondary flex items-start mb-5 lg:mb-6">
            {highlights}
          </p>

          {/* Creator Information */}
          <div className="flex items-center gap-3 mb-5 lg:mb-6 pb-5 lg:pb-6 border-b border-border">
            {/* Creator Avatar Placeholder */}
            <div
              className="w-10 h-10 rounded-full bg-muted border border-border 
            flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <span className="text-text-secondary text-sm font-medium">
                {creator.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Creator Details */}
            <div className="flex-1 min-w-0">
              <a
                href={creator.link}
                className="text-foreground font-medium hover:text-primary transition-colors block truncate"
              >
                {creator.name}
              </a>
              <p className="text-sm text-text-secondary dark:text-text-white truncate">
                {creator.location}
              </p>
            </div>
          </div>

          {/* Funding Information */}
          <div className="mb-5 lg:mb-6">
            {/* Amount Pledged */}
            <div className="mb-2 flex justify-between items-baseline text-text-secondary dark:text-text-white">
              <p className="text-3xl lg:text-4xl font-semibold">
                {currency} {formattedPledged}
              </p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xl ">
                  {backers.toLocaleString()}
                </span>
                <span>backers</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Campaign progress: ${progressPercent}% funded`}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Campaign Metrics */}
            <div className="flex items-center gap-1 text-text-secondary dark:text-text-white text-sm">
              <p className="text-sm mt-0.5">
                pledged of {currency} {formattedGoal} goal
              </p>
              <span className="mx-2">•</span>
              <span className="font-semibold">{daysLeft}</span>
              <span>days left</span>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="space-y-3">
            {/* Primary CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onPickPerk}
            >
              PICK YOUR PERK
            </Button>

            {/* Secondary Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="white"
                size="md"
                className="flex-1 min-w-[140px]"
                onClick={onSave}
                aria-label="Save campaign for later"
              >
                SAVE FOR LATER
              </Button>
              <Button
                variant="white"
                size="md"
                className="flex-1 min-w-[140px]"
                onClick={onShare}
                aria-label="Share campaign"
              >
                SHARE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHeader;
