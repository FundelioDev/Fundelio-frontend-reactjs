import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import RelatedCampaigns from '@/components/campaign/RelatedCampaigns';
import { mockProjects } from '@/data/mockProjects';
import { mockCampaignStory, getBlanksFromSections } from '@/data/mockCampaignStory';
import { getPreviewData, isPreviewId } from '@/utils/previewStorage';

/**
 * Transform preview data from create page to campaign detail format
 */
function transformPreviewData(previewData) {
  const { basics, story, rewards } = previewData;
  console.log('Transforming preview data:', previewData);

  // Calculate days left
  const endDate = basics?.endTime ? new Date(basics.endTime) : new Date();
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

  return {
    campaign: {
      campaign_id: 'preview',
      title: basics?.title || 'Untitled Campaign',
      description: basics?.description || '',
      goal_amount: basics?.goalAmount || 50000.00,
      pledged_amount: 0,
      backers_count: 0,
      category: basics?.category || 'Uncategorized',
      intro_video_url: basics?.introVideoUrl || null,
      start_date: basics?.startTime || new Date().toISOString().split('T')[0],
      end_date: basics?.endTime || new Date().toISOString().split('T')[0],
      status: 'preview',
      imageUrl: basics?.imageUrl || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
      currency: 'USD',
      daysLeft,
      pledged: 0,
      goal: basics?.goalAmount || 50000.00,
      backers: 0,
    },
    rewards: rewards?.rewards || [],
    items: rewards?.items || [],
    addOns: rewards?.addOns || [],
    blanks: story?.blanks || [],
    creator: {
      name: 'Preview Creator',
      username: 'Creator',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'This is a preview of your campaign.',
      badges: [],
      stats: {
        createdProjects: 0,
        backedProjects: 0,
        lastLogin: new Date().toLocaleDateString(),
        accountCreated: new Date().toLocaleDateString()
      },
      socials: {},
      isVerified: false,
      moreHref: '#',
    },
    otherProjects: [],
  };
}

/**
 * Get mock campaign data for public mode
 */
function getMockCampaignData() {
  return {
    campaign: {
      campaign_id: 'odin-3',
      founder_id: 'founder-003',
      title: 'Odin 3: The Ultimate 6" 120Hz OLED Gaming Handheld',
      description: '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen | Full Size Stick | 8000mAh | 390g | Ergonomic Grip | Premium Build Quality with Advanced Cooling System',
      goal_amount: 50000.00,
      pledged_amount: 7697612.00,
      backers_count: 2018,
      category: 'Game',
      intro_video_url: 'https://www.youtube.com/embed/example',
      start_date: '2025-10-15',
      end_date: '2025-11-19',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
      currency: 'USD',
      daysLeft: 4,
      pledged: 7697612.00,
      goal: 50000.00,
      backers: 2018,
      creator: {
        name: 'AYN Technologies',
        location: 'Shenzhen, China',
        link: '#creator-profile',
      },
    },
    rewards: [
      {
        reward_id: 'reward-001',
        campaign_id: 'odin-3',
        title: 'DiskPro 1TB [Kickstarter Price]',
        description: 'DiskPro Kickstarter Price! 16.7% Off the retail price!\n\nBuilt-in 1TB SSD for massive storage capacity. Ultra-fast read/write speeds up to 550MB/s. Compact and portable design fits in your pocket.',
        image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop',
        min_pledge_amount: 199.00,
        ships_to: 'Only certain countries',
        estimated_delivery: '2025-12-01',
        status: 'active',
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
        description: 'Limited Early Bird offer! 2TB storage for power users.\n\nDouble the storage, same blazing-fast speed. Perfect for professionals and content creators. Only 50 units available at this price!',
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
    ],
    items: [],
    addOns: [],
    blanks: getBlanksFromSections(mockCampaignStory.sections),
    creator: {
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
    },
    otherProjects: mockProjects.slice(0, 4).map(project => ({
      ...project,
      image: project.imageUrl,
      fundingGoal: project.goal,
      currentFunding: project.pledged,
      backers: project.backerCount,
    })),
  };
}

export default function CampaignDetailPage() {
  const { previewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const loadCampaignData = async () => {
      setLoading(true);

      if (previewId && isPreviewId(previewId)) {
        setIsPreview(true);

        const stateData = location.state?.campaignData;

        if (stateData) {
          setCampaignData(transformPreviewData(stateData));
        } else {
          const storedData = getPreviewData(previewId);

          if (storedData) {
            setCampaignData(transformPreviewData(storedData));
          } else {
            console.error('Preview data not found');
            navigate('/campaigns/create');
            return;
          }
        }
      } else {
        setIsPreview(false);
        setCampaignData(getMockCampaignData());
      }

      setLoading(false);
    };

    loadCampaignData();
  }, [previewId, location.state, navigate]);

  const handlePickPerk = () => console.log('Pick Your Perk clicked');
  const handleSave = () => console.log('Save For Later clicked');
  const handleShare = () => console.log('Share clicked');
  const handlePledge = (pledgeData) => console.log('Pledge:', pledgeData);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light-2 dark:bg-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="min-h-screen bg-background-light-2 dark:bg-darker flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-foreground">Không tìm thấy chiến dịch</p>
          <p className="mt-2 text-muted-foreground">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light-2 dark:bg-darker">
      {isPreview && (
        <div className="bg-amber-500 text-white pb-3 pt-20 px-4 text-center">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🔍 Chế độ xem trước</span>
              <span className="text-sm opacity-90">
                Đây là bản xem trước chiến dịch của bạn. Người khác sẽ không thấy trang này.
              </span>
            </div>
            <button
              onClick={() => navigate('/campaigns/create')}
              className="bg-white text-amber-600 px-4 py-1.5 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              ← Quay lại chỉnh sửa
            </button>
          </div>
        </div>
      )}

      <CampaignHeader
        campaign={campaignData.campaign}
        onPickPerk={handlePickPerk}
        onSave={handleSave}
        onShare={handleShare}
      />

      <CampaignTabs
        initialTab="campaign"
        campaignProps={{
          rewards: campaignData.rewards,
          items: campaignData.items,
          addOns: campaignData.addOns,
          creator: campaignData.creator,
          otherProjects: campaignData.otherProjects,
          blanks: campaignData.blanks,
          currency: campaignData.campaign.currency,
          onPledge: handlePledge,
        }}
      />

      {/* Related Campaigns Section */}
      <RelatedCampaigns
        category={campaignData.campaign.category}
        currentCampaignId={campaignData.campaign.campaign_id}
      />
    </div>
  );
}

export { CampaignDetailPage };
