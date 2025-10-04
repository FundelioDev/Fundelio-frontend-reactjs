import React from 'react';
import CampaignHeader from '@/components/campaign/CampaignHeader';

/**
 * CampaignDetailPage Component
 * Displays the full campaign detail page with header and additional content
 */
export default function CampaignDetailPage() {
  // Mock campaign data
  const campaignData = {
    title: 'Odin 3: The Ultimate 6" 120Hz OLED Gaming Handheld',
    highlights:
      '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen | Full Size Stick | 8000mAh | 390g | Ergonomic Grip | Premium Build Quality with Advanced Cooling System',
    creator: {
      name: 'AYN Technologies',
      location: 'Shenzhen, China',
      link: '#creator-profile',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
    currency: 'USD',
    pledged: 7697612,
    goal: 50000,
    backers: 2018,
    daysLeft: 4,
  };

  // Handler functions
  const handlePickPerk = () => {
    console.log('Pick Your Perk clicked');
    // Navigate to perks section or show perks modal
  };

  const handleSave = () => {
    console.log('Save For Later clicked');
    // Save campaign to user's saved list
  };

  const handleShare = () => {
    console.log('Share clicked');
    // Open share modal or native share dialog
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      {/* Campaign Header Section */}
      <CampaignHeader
        campaign={campaignData}
        onPickPerk={handlePickPerk}
        onSave={handleSave}
        onShare={handleShare}
      />

      {/* Additional Campaign Content Sections */}
      <div className="max-w-container mx-auto px-4 lg:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Campaign Story Placeholder */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Campaign Story
              </h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="mb-4">
                  Experience gaming like never before with the Odin 3, the most
                  powerful handheld gaming device on the market. Featuring the
                  latest Snapdragon 8 Elite processor and an exclusive 6" 120Hz
                  AMOLED touchscreen, this device delivers console-quality
                  gaming in the palm of your hand.
                </p>
                <p className="mb-4">
                  We've listened to the community and designed the Odin 3 with
                  full-size analog sticks, an ergonomic grip that reduces
                  fatigue during extended gaming sessions, and a massive 8000mAh
                  battery that keeps you gaming all day long.
                </p>
                <p>
                  Join thousands of backers who have already supported this
                  revolutionary gaming handheld. With only 4 days left, don't
                  miss your chance to be part of gaming history!
                </p>
              </div>
            </div>

            {/* Perks Section Placeholder */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Available Perks
              </h2>
              <p className="text-text-secondary">
                Perk options will be displayed here...
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            {/* Campaign Updates Placeholder */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Recent Updates
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Update #12: Production Timeline
                  </p>
                  <p className="text-xs text-text-secondary">2 days ago</p>
                </div>
                <div className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Update #11: Stretch Goals Unlocked!
                  </p>
                  <p className="text-xs text-text-secondary">5 days ago</p>
                </div>
                <div className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Update #10: New Color Options
                  </p>
                  <p className="text-xs text-text-secondary">1 week ago</p>
                </div>
              </div>
            </div>

            {/* FAQ Placeholder */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-foreground hover:text-primary">
                    When will it ship?
                  </summary>
                  <p className="text-sm text-text-secondary mt-2 pl-4">
                    Estimated shipping: March 2026
                  </p>
                </details>
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-foreground hover:text-primary">
                    What's the warranty?
                  </summary>
                  <p className="text-sm text-text-secondary mt-2 pl-4">
                    1-year manufacturer warranty included
                  </p>
                </details>
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-foreground hover:text-primary">
                    International shipping?
                  </summary>
                  <p className="text-sm text-text-secondary mt-2 pl-4">
                    Yes, worldwide shipping available
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export named for backward compatibility
export { CampaignDetailPage };
