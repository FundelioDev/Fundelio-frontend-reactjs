import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Edit, X } from 'lucide-react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import RelatedCampaigns from '@/components/campaign/RelatedCampaigns';
import { getPreviewData, isPreviewId } from '@/utils/previewStorage';
import { campaignApi } from '@/api/campaignApi';
import { rewardApi } from '@/api/rewardApi';
import { getBlanksFromSections } from '@/data/mockCampaignStory';
import { useCampaignProgress } from '@/websocket/hooks';
import { useAuth } from '@/contexts/AuthContext';

export default function CampaignDetailPage() {
  const { previewId, campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaign');
  const { user } = useAuth();

  // Check if we're in preview mode based on route path
  const isPreview = location.pathname.includes('/preview/');

  // Check if opened from admin (to hide edit button)
  const fromAdmin = location.state?.fromAdmin || false;

  const loadRewards = async (campId) => {
    try {
      const response = await rewardApi.getRewardsWithItems(campId);
      if (response?.data?.data?.content) {
        setRewards(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
  };

  // Subscribe to campaign progress updates (real-time)
  const handleCampaignProgress = useCallback((progressData) => {

    setCampaignData(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        // Update các fields từ progress data
        currentAmount: progressData.currentAmount ?? prev.currentAmount,
        backerCount: progressData.backerCount ?? prev.backerCount,
        percentFunded: progressData.percentFunded ?? prev.percentFunded,
        // Có thể thêm các fields khác từ progressData nếu backend trả về
      };
    });
  }, []);

  useCampaignProgress(
    // Only subscribe if we have a real campaign ID (not in preview mode with preview ID)
    campaignData?.campaignId && !isPreview ? campaignData.campaignId : null,
    handleCampaignProgress
  );

  // Refresh rewards when switching tabs (both Story and Rewards tabs show rewards)
  useEffect(() => {
    if ((activeTab === 'campaign' || activeTab === 'rewards') && campaignData?.campaignId) {
      loadRewards(campaignData.campaignId);
    }
  }, [activeTab, campaignData?.campaignId]);

  useEffect(() => {
    const loadCampaignData = async () => {
      setLoading(true);

      try {
        // Preview mode - check previewId
        if (isPreview && previewId) {
          console.log('Preview mode - previewId:', previewId);

          // First try to load real campaign if previewId is actually a campaignId (UUID)
          if (!isPreviewId(previewId)) {
            const response = await campaignApi.getCampaignById(previewId);

            if (response?.data?.data) {
              const apiData = response.data.data;

              // Calculate days left
              const endDate = apiData.endDate ? new Date(apiData.endDate) : new Date();
              const today = new Date();
              const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

              // Process campaign sections to get blanks for story tab
              const blanks = apiData.campaignSections ? getBlanksFromSections(apiData.campaignSections) : [];

              setCampaignData({
                ...apiData,
                daysLeft,
                blanks,
                currency: 'VND',
              });

              // Load rewards immediately after campaign data
              await loadRewards(apiData.campaignId);
            } else {
              console.error('Campaign not found');
              navigate('/campaigns/create');
            }
          } else {
            // It's a real preview ID - load from localStorage
            const stateData = location.state?.campaignData;
            console.log('Preview ID mode - state data:', stateData);

            if (stateData) {
              const { basics, story, rewards: previewRewards } = stateData;

              // Calculate days left
              const endDate = basics?.endDate ? new Date(basics.endDate) : new Date();
              const today = new Date();
              const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

              setCampaignData({
                ...basics,
                daysLeft,
                blanks: story?.blanks || [],
                currency: 'VND',
              });

              // Set preview rewards if available
              if (previewRewards?.rewards) {
                setRewards(previewRewards.rewards);
              }
            } else {
              const storedData = getPreviewData(previewId);
              console.log('Stored preview data:', storedData);

              if (storedData) {
                const { basics, story, rewards: previewRewards } = storedData;

                const endDate = basics?.endDate ? new Date(basics.endDate) : new Date();
                const today = new Date();
                const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

                setCampaignData({
                  ...basics,
                  daysLeft,
                  blanks: story?.blanks || [],
                  currency: 'VND',
                });

                if (previewRewards?.rewards) {
                  setRewards(previewRewards.rewards);
                }
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
            const apiData = response.data.data;
            console.log('API data:', apiData);

            // Calculate days left
            const endDate = apiData.endDate ? new Date(apiData.endDate) : new Date();
            const today = new Date();
            const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

            // Process campaign sections to get blanks for story tab
            const blanks = apiData.campaignSections ? getBlanksFromSections(apiData.campaignSections) : [];

            setCampaignData({
              ...apiData,
              daysLeft,
              blanks,
              currency: 'VND',
            });

            // Load rewards immediately after campaign data
            await loadRewards(apiData.campaignId);
          } else {
            console.error('Campaign not found');
          }
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
      }

      setLoading(false);
    };

    loadCampaignData();
  }, [previewId, campaignId, isPreview, location.state, navigate]);

  const avatarUrl = useMemo(() => {
    const owner = campaignData?.owner;
    if (!owner) return null;
    // Return avatarUrl from owner, or null if not available
    return owner.avatarUrl || null;
  }, [campaignData?.owner]);

  const handlePickPerk = () => console.log('Pick Your Perk clicked');
  const handleSave = () => console.log('Save For Later clicked');
  const handleShare = () => console.log('Share clicked');
  const handlePledge = (pledgeData) => console.log('Pledge:', pledgeData);

  const handleTabChange = (tabId) => {
    console.log("Tab changed to:", tabId);
    setActiveTab(tabId);

    // Scroll to tabs section smoothly
    setTimeout(() => {
      const tabsElement = document.querySelector('[role="tablist"]');
      if (tabsElement) {
        const offsetTop = tabsElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: offsetTop - 20, // 20px offset for better visibility
          behavior: 'smooth'
        });
      }
    }, 100);
  };

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

  const normalizeBackendDate = (dateString) => {
    if (!dateString) return null;
    try {
      const trimmed = dateString.trim();
      const withoutMeridiem = trimmed.replace(/\s(AM|PM)$/i, '');
      const isoLike = withoutMeridiem.replace(' ', 'T');
      const parsed = new Date(isoLike);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
      const fallback = new Date(dateString);
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    } catch {
      return null;
    }
  };

  const formatDateForDisplay = (date) => {
    if (!date) return new Date().toLocaleDateString('vi-VN');
    return date.toLocaleDateString('vi-VN');
  };

  console.log("campaignData", campaignData)

  const creatorData = campaignData.owner ? {
    userId: campaignData.owner.userId,
    name: `${campaignData.owner.firstName || ''} ${campaignData.owner.lastName || ''}`.trim() || 'Creator',
    username: campaignData.owner.email || 'creator',
    avatar: avatarUrl,
    avatarUrl: avatarUrl, // Also include avatarUrl for compatibility
    bio: campaignData.owner.bio || 'Campaign creator',
    badges: [],
    stats: {
      createdProjects: 0,
      backedProjects: 0,
      lastLogin: new Date().toLocaleDateString('vi-VN'),
      accountCreated: formatDateForDisplay(normalizeBackendDate(campaignData.owner.createdAt))
    },
    socials: {},
    isVerified: false,
    moreHref: '#creator-profile',
  } : null;

  const campaignOwnerId = campaignData?.owner?.userId || campaignData?.owner?.id;
  const currentUserId = user?.userId || user?.id;
  const isOwnerViewing = Boolean(currentUserId && campaignOwnerId && currentUserId === campaignOwnerId);

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
                      : campaignData?.campaignId;

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
          campaign={campaignData}
          onPickPerk={handlePickPerk}
          onSave={handleSave}
          onShare={handleShare}
          onTabChange={handleTabChange}
          isPreview={isPreview}
          isOwnerViewing={isOwnerViewing}
        />

        {isPreview ?
          <CampaignTabs
            initialTab={activeTab}
            onTabChange={handleTabChange}
            campaignProps={{
              rewards: rewards,
              creator: creatorData,
              otherProjects: [], // TODO: Add related projects
              blanks: campaignData.blanks || [],
              currency: campaignData.currency || 'VND',
              onPledge: handlePledge,
              campaignId: campaignData.campaignId,
              isPreview: true,
              isOwnerViewing,
            }}
          /> : <CampaignTabs
            initialTab={activeTab}
            onTabChange={handleTabChange}
            campaignProps={{
              rewards: rewards,
              creator: creatorData,
              otherProjects: [], // TODO: Add related projects
              blanks: campaignData.blanks || [],
              currency: campaignData.currency || 'VND',
              onPledge: handlePledge,
              campaignId: campaignData.campaignId,
              isOwnerViewing,
            }}
          />
        }

        {/* Related Campaigns Section */}
        <RelatedCampaigns
          category={campaignData.campaignCategory}
          currentCampaignId={campaignData.campaignId}
        />
      </div>
    </div>
  );
}

export { CampaignDetailPage };
