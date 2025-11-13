import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Edit, X } from 'lucide-react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import RelatedCampaigns from '@/components/campaign/RelatedCampaigns';
import { mockProjects } from '@/data/mockProjects';
import { mockCampaignStory, getBlanksFromSections } from '@/data/mockCampaignStory';
import { getPreviewData, isPreviewId } from '@/utils/previewStorage';
import { campaignApi } from '@/api/campaignApi';

function transformApiData(apiData) {
  console.log('Transforming API data:', apiData);
  console.log('campaignSections:', apiData.campaignSections);

  // Calculate days left
  const endDate = apiData.endTime ? new Date(apiData.endTime) : new Date();
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

  const blanks = apiData.campaignSections ? getBlanksFromSections(apiData.campaignSections) : [];
  console.log('Transformed blanks:', blanks);

  return {
    campaign: {
      campaignId: apiData.campaignId,
      founderId: apiData.founderId,
      title: apiData.title || 'Untitled Campaign',
      description: apiData.description || '',
      highlights: apiData.description || '',
      goalAmount: apiData.goalAmount || 0,
      pledgedAmount: apiData.currentAmount || 0,
      backersCount: apiData.totalBackers || 0,
      category: apiData.campaignCategory || 'Uncategorized',
      introImageUrl: apiData.introImageUrl || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
      introVideoUrl: apiData.introVideoUrl || null,
      startDate: apiData.startTime ? apiData.startTime.split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: apiData.endTime ? apiData.endTime.split('T')[0] : new Date().toISOString().split('T')[0],
      status: apiData.status || 'active',
      currency: 'VND',
      daysLeft,
      pledged: apiData.currentAmount || 0,
      goal: apiData.goalAmount || 0,
      backers: apiData.totalBackers || 0,
      creator: {
        name: apiData.owner?.fullName || 'Creator',
        location: 'Vietnam',
        link: '#creator-profile',
      },
    },
    rewards: apiData.rewards || [],
    items: apiData.items || [],
    addOns: apiData.addOns || [],
    blanks: blanks,
    creator: {
      name: apiData.owner?.fullName || 'Creator',
      username: apiData.owner?.username || 'creator',
      avatar: apiData.owner?.profileImage || 'https://i.pravatar.cc/150?img=12',
      bio: apiData.owner?.bio || 'Campaign creator',
      badges: [],
      stats: {
        createdProjects: 0,
        backedProjects: 0,
        lastLogin: new Date().toLocaleDateString(),
        accountCreated: new Date().toLocaleDateString()
      },
      socials: {},
      isVerified: false,
      moreHref: '#creator-profile',
    },
    otherProjects: [],
  };
}


function transformPreviewData(previewData) {
  const { basics, story, rewards } = previewData;
  console.log('Transforming preview data:', previewData);

  // Calculate days left
  const endDate = basics?.endTime ? new Date(basics.endTime) : new Date();
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

  return {
    campaign: {
      campaignId: basics?.campaignId || 'preview',
      title: basics?.title || 'Untitled Campaign',
      description: basics?.description || '',
      highlights: basics?.description || '',
      goalAmount: basics?.goalAmount || 50000.00,
      pledgedAmount: 0,
      backersCount: 0,
      category: basics?.campaignCategory || 'Uncategorized',
      introImageUrl: basics?.introImageUrl || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
      introVideoUrl: basics?.introVideoUrl || null,
      startDate: basics?.startTime || new Date().toISOString().split('T')[0],
      endDate: basics?.endTime || new Date().toISOString().split('T')[0],
      status: 'preview',
      currency: 'VND',
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
 * Using camelCase convention
 */
function getMockCampaignData() {
  return {
    campaign: {
      campaignId: 'odin-3',
      founderId: 'founder-003',
      title: 'Odin 3: The Ultimate 6" 120Hz OLED Gaming Handheld',
      description: '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen | Full Size Stick | 8000mAh | 390g | Ergonomic Grip | Premium Build Quality with Advanced Cooling System',
      goalAmount: 50000.00,
      pledgedAmount: 7697612.00,
      backersCount: 2018,
      category: 'Game',
      introVideoUrl: 'https://www.youtube.com/embed/example',
      startDate: '2025-10-15',
      endDate: '2025-11-19',
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
        rewardId: 'reward-001',
        campaignId: 'odin-3',
        title: 'DiskPro 1TB [Kickstarter Price]',
        description: 'DiskPro Kickstarter Price! 16.7% Off the retail price!\n\nBuilt-in 1TB SSD for massive storage capacity. Ultra-fast read/write speeds up to 550MB/s. Compact and portable design fits in your pocket.',
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop',
        minPledgeAmount: 199.00,
        shipsTo: 'Only certain countries',
        estimatedDelivery: '2025-12-01',
        status: 'active',
        backers: 4,
        itemsIncluded: 4,
        addOnCount: 1,
        thumbnails: [
          'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=150&auto=format&fit=crop',
        ],
        items: [
          { itemId: 'item-001', qty: 1 },
          { itemId: 'item-002', qty: 2 },
          { itemId: 'item-003', qty: 1 },
        ],
      },
      {
        rewardId: 'reward-002',
        campaignId: 'odin-3',
        title: 'Early Bird Special - 2TB Edition',
        description: 'Limited Early Bird offer! 2TB storage for power users.\n\nDouble the storage, same blazing-fast speed. Perfect for professionals and content creators. Only 50 units available at this price!',
        imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
        minPledgeAmount: 349.00,
        shipsTo: 'Worldwide',
        estimatedDelivery: '2026-01-15',
        status: 'active',
        backers: 12,
        itemsIncluded: 5,
        addOnCount: 2,
        thumbnails: [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
        ],
        items: [
          { itemId: 'item-001', qty: 1 },
          { itemId: 'item-002', qty: 1 },
          { itemId: 'item-004', qty: 1 },
          { itemId: 'item-005', qty: 2 },
        ],
      },
    ],
    items: [
      {
        id: 'item-001',
        title: 'DiskPro Main Unit',
        description: 'High-performance portable SSD with USB-C connectivity',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'item-002',
        title: 'USB-C Cable (1m)',
        description: 'Premium USB-C to USB-C cable for data transfer and charging',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'item-003',
        title: 'Protective Case',
        description: 'Shockproof protective carrying case with soft interior',
        image: 'https://images.unsplash.com/photo-1759673824881-0ddb7f27d970?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674',
      },
      {
        id: 'item-004',
        title: 'USB-A Adapter',
        description: 'USB-C to USB-A adapter for legacy devices',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'item-005',
        title: 'Quick Start Guide',
        description: 'Detailed setup and usage instructions',
        image: 'https://images.unsplash.com/photo-1554224311-8727d7d4b7e5?q=80&w=300&auto=format&fit=crop',
      },
    ],
    addOns: [
      {
        id: 'addon-001',
        title: 'Extended Warranty (2 Years)',
        description: 'Extend your warranty coverage for an additional 2 years with priority support',
        price: 49.00,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=300&auto=format&fit=crop',
        offeredWithRewardIds: ['reward-001', 'reward-002'],
      },
      {
        id: 'addon-002',
        title: 'Extra USB-C Cable (2m)',
        description: 'Longer USB-C cable for more flexibility in your setup',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=300&auto=format&fit=crop',
        offeredWithRewardIds: ['reward-001', 'reward-002'],
      },
      {
        id: 'addon-003',
        title: 'Premium Leather Pouch',
        description: 'Handcrafted genuine leather pouch for elegant storage',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=300&auto=format&fit=crop',
        offeredWithRewardIds: ['reward-001', 'reward-002'],
      },
      {
        id: 'addon-004',
        title: 'USB Hub (4-Port)',
        description: '4-port USB hub with individual power switches',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=300&auto=format&fit=crop',
        offeredWithRewardIds: ['reward-002'],
      },
      {
        id: 'addon-005',
        title: 'Cleaning Kit',
        description: 'Professional cleaning kit with microfiber cloth and cleaning solution',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=300&auto=format&fit=crop',
        offeredWithRewardIds: ['reward-001', 'reward-002'],
      },
    ],
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
  const { previewId, campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if we're in preview mode based on route path
  const isPreview = location.pathname.includes('/preview/');

  // Check if opened from admin (to hide edit button)
  const fromAdmin = location.state?.fromAdmin || false; useEffect(() => {
    const loadCampaignData = async () => {
      setLoading(true);

      try {
        // Preview mode - check previewId
        if (isPreview && previewId) {
          console.log('Preview mode - previewId:', previewId, 'isPreviewId:', isPreviewId(previewId));

          // First try to load real campaign if previewId is actually a campaignId (UUID)
          if (!isPreviewId(previewId)) {
            console.log('Loading real campaign data for preview:', previewId);
            const response = await campaignApi.getCampaignById(previewId);

            if (response?.data?.data) {
              const transformedData = transformApiData(response.data.data);
              console.log('Transformed API data for preview:', transformedData);
              console.log('Blanks count:', transformedData.blanks?.length);
              setCampaignData(transformedData);
            } else {
              console.error('Campaign not found');
              setCampaignData(getMockCampaignData());
            }
          } else {
            // It's a real preview ID
            const stateData = location.state?.campaignData;
            console.log('Preview ID mode - state data:', stateData);

            if (stateData) {
              const transformedData = transformPreviewData(stateData);
              console.log('Transformed preview data:', transformedData);
              setCampaignData(transformedData);
            } else {
              const storedData = getPreviewData(previewId);
              console.log('Stored preview data:', storedData);

              if (storedData) {
                setCampaignData(transformPreviewData(storedData));
              } else {
                console.error('Preview data not found');
                navigate('/campaigns/create');
                return;
              }
            }
          }
        }
        // Normal mode - load campaign by ID
        else if (campaignId) {
          console.log('Normal mode - loading campaign:', campaignId);
          const response = await campaignApi.getCampaignById(campaignId);

          if (response?.data?.data) {
            const transformedData = transformApiData(response.data.data);
            console.log('Transformed API data:', transformedData);
            setCampaignData(transformedData);
          } else {
            console.error('Campaign not found');
            setCampaignData(getMockCampaignData());
          }
        }
        // Default mock data
        else {
          console.log('Using mock data');
          setCampaignData(getMockCampaignData());
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        setCampaignData(getMockCampaignData());
      }

      setLoading(false);
    };

    loadCampaignData();
  }, [previewId, campaignId, isPreview, location.state, navigate]);

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
        <div className="bg-blue-600 dark:bg-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 fixed top-0 left-0 right-0 z-40 shadow-lg">
          <div className="container mx-auto flex sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-semibold text-sm sm:text-base">Chế độ xem trước</span>
                <span className="text-xs sm:text-sm opacity-90">
                  {fromAdmin ? 'Xem trước chiến dịch từ Admin' : 'Chỉ bạn mới thấy trang này'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!fromAdmin && (
                <button
                  onClick={() => {
                    // Get the real campaign ID from previewId or campaignData
                    const realCampaignId = previewId && !isPreviewId(previewId)
                      ? previewId
                      : campaignData?.campaign?.campaignId;

                    if (realCampaignId && realCampaignId !== 'preview') {
                      navigate(`/campaigns/${realCampaignId}/edit?tab=basic`);
                    } else {
                      navigate('/campaigns/create');
                    }
                  }}
                  className="flex items-center gap-1.5 bg-white text-blue-600 dark:text-blue-700 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-100 transition-colors whitespace-nowrap flex-1 sm:flex-none justify-center"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Thoát xem trước</span>
                  <span className="sm:hidden">Chỉnh sửa</span>
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 bg-blue-700 dark:bg-blue-800 text-white px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors border border-blue-500 dark:border-blue-600 whitespace-nowrap"
                aria-label="Đóng preview"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Đóng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={isPreview ? 'pt-[52px] sm:pt-[58px]' : ''}>
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
          currentCampaignId={campaignData.campaign.campaignId}
        />
      </div>
    </div>
  );
}

export { CampaignDetailPage };
