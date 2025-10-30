import React from 'react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import { mockProjects } from '@/data/mockProjects';
import { mockCampaignStory, getBlanksFromSections } from '@/data/mockCampaignStory';

/**
 * CampaignDetailPage Component
 * Displays the full campaign detail page with header and additional content
 * Uses ERD schema for all data structures
 */
export default function CampaignDetailPage() {
  // Mock campaign data - Based on campaigns table in ERD
  const campaignData = {
    campaign_id: 'odin-3',
    founder_id: 'founder-003',
    title: 'Odin 3: The Ultimate 6" 120Hz OLED Gaming Handheld',
    description: '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen | Full Size Stick | 8000mAh | 390g | Ergonomic Grip | Premium Build Quality with Advanced Cooling System',
    goal_amount: 50000.00,
    pledged_amount: 7697612.00,
    backers_count: 2018,
    category: 'gaming',
    intro_video_url: 'https://www.youtube.com/embed/example',
    start_date: '2025-10-15',
    end_date: '2025-11-19',
    status: 'active',
    // Additional fields for UI display
    highlights: [
      '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen',
      'Full Size Stick | 8000mAh | 390g | Ergonomic Grip',
      'Premium Build Quality with Advanced Cooling System',
    ],
    creator: {
      name: 'AYN Technologies',
      location: 'Shenzhen, China',
      link: '#creator-profile',
    },
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
    currency: 'USD',
    daysLeft: 4,
  };

  // Mock rewards data - Based on rewards table in ERD
  const rewards = [
    {
      reward_id: 'reward-001',
      campaign_id: 'odin-3',
      title: 'DiskPro 1TB [Kickstarter Price]',
      description: `DiskPro Kickstarter Price! 16.7% Off the retail price!\n\nBuilt-in 1TB SSD for massive storage capacity. Ultra-fast read/write speeds up to 550MB/s. Compact and portable design fits in your pocket.`,
      image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop',
      min_pledge_amount: 199.00,
      ships_to: 'Only certain countries',
      estimated_delivery: '2025-12-01',
      status: 'active',
      // Additional fields for UI (could be from pledges aggregate or separate table)
      backers: 4,
      itemsIncluded: 4,
      addOnCount: 1,
      thumbnails: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=150&auto=format&fit=crop',
      ],
    },
    {
      reward_id: 'reward-002',
      campaign_id: 'odin-3',
      title: 'Early Bird Special - 2TB Edition',
      description: `Limited Early Bird offer! 2TB storage for power users.\n\nDouble the storage, same blazing-fast speed. Perfect for professionals and content creators. Only 50 units available at this price!`,
      image_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
      min_pledge_amount: 349.00,
      ships_to: 'Worldwide',
      estimated_delivery: '2026-01-15',
      status: 'active',
      backers: 12,
      itemsIncluded: 5,
      addOnCount: 2,
      thumbnails: [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
      ],
    },
  ];

  // Mock creator data
  const creator = {
    name: 'Restoration Games',
    username: 'Justin Jacobson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'We take all those games you remember from back-in-the-day, fix them up, and bring them back for the modern gamer. Publishers of Return To Dark Tower, Unmatched, Thunder Road: Vendetta, and more. Every game deserves another turn.',
    badges: [
      { type: 'favorite', label: 'Backer Favorite' },
      { type: 'repeat', label: 'Repeat Creator' },
      { type: 'super', label: 'Superbacker' }
    ],
    stats: {
      createdProjects: 11,
      backedProjects: 227,
      lastLogin: 'Oct 23 2025',
      accountCreated: 'Dec 2016'
    },
    socials: {
      website: 'restorationgames.com',
      twitter: 'RestorationGame',
      facebook: 'RestorationGames',
      location: 'Sunrise, FL'
    },
    isVerified: true,
    moreHref: '#creator-profile',
  };

  // Mock other projects by this creator (import from mockProjects)
  const otherProjects = mockProjects.slice(0, 4).map(project => ({
    ...project,
    image: project.imageUrl,
    fundingGoal: project.goal,
    currentFunding: project.pledged,
    backers: project.backerCount,
  }));

  // Mock story blanks - Convert from campaign_sections to blanks format
  const blanks = getBlanksFromSections(mockCampaignStory.sections);

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

  const handlePledge = (pledgeData) => {
    console.log('Pledge:', pledgeData);
    // Handle pledge action - would create entry in pledges table
  };

  return (
    <div className="min-h-screen bg-background-light-2 dark:bg-darker">
      {/* Campaign Header Section */}
      <CampaignHeader
        campaign={{
          ...campaignData,
          // Map ERD fields to component props
          pledged: campaignData.pledged_amount,
          goal: campaignData.goal_amount,
          backers: campaignData.backers_count,
        }}
        onPickPerk={handlePickPerk}
        onSave={handleSave}
        onShare={handleShare}
      />

      {/* Tabbed Content */}
      <CampaignTabs
        initialTab="campaign"
        campaignProps={{
          rewards,
          creator,
          otherProjects,
          blanks,
          currency: campaignData.currency,
          onPledge: handlePledge,
        }}
      />
    </div>
  );
}

// Export named for backward compatibility
export { CampaignDetailPage };
