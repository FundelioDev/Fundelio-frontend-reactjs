/**
 * Transform campaign data from API to ProjectCard format
 */
export function transformCampaignToProject(campaign) {
  if (!campaign) return null;

  // Calculate days left
  const endDate = new Date(campaign.endTime);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

  // Calculate progress percentage
  const progressPercent = campaign.goalAmount > 0
    ? Math.min(100, Math.round((campaign.pledgedAmount / campaign.goalAmount) * 100))
    : 0;

  // Map campaign status to variant
  const getVariant = (status) => {
    if (status === 'ENDED' || status === 'FAILED') return 'expired';
    return 'default';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get placeholder image based on category
  const getPlaceholderImage = (category) => {
    const placeholders = {
      'art': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
      'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
      'games': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop',
      'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
      'music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop',
      'film': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop',
      'food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
      'fashion': 'https://images.unsplash.com/photo-1558769132-cb1aea7c8a0b?w=600&h=600&fit=crop',
      'publishing': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
      'photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop',
    };
    return placeholders[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=600&fit=crop';
  };

  return {
    id: campaign.campaignId,
    title: campaign.title,
    description: campaign.description || '',
    authorName: campaign.owner 
      ? `${campaign.owner.firstName || ''} ${campaign.owner.lastName || ''}`.trim() 
      : 'Unknown',
    authorAvatarUrl: campaign.owner?.avatarUrl || null,
    imageUrl: campaign.imageUrl || getPlaceholderImage(campaign.category),
    category: campaign.category || 'Crowdfunding',
    location: campaign.location || '',
    daysLeft,
    progressPercent,
    pledged: formatCurrency(campaign.pledgedAmount || 0),
    goal: formatCurrency(campaign.goalAmount || 0),
    backerCount: campaign.backersCount || 0,
    likeCount: campaign.likesCount || 0,
    status: campaign.campaignStatus,
    variant: getVariant(campaign.campaignStatus),
    bookmarked: false, // TODO: Implement bookmark feature
    // Additional fields for dashboard
    rawPledged: campaign.pledgedAmount || 0,
    rawGoal: campaign.goalAmount || 0,
    startTime: campaign.startTime,
    endTime: campaign.endTime,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

/**
 * Transform array of campaigns from API to ProjectCard format
 */
export function transformCampaignsToProjects(campaigns) {
  if (!Array.isArray(campaigns)) return [];
  return campaigns.map(transformCampaignToProject).filter(Boolean);
}

/**
 * Get status label in Vietnamese
 */
export function getCampaignStatusLabel(status) {
  const statusMap = {
    'DRAFT': 'Nháp',
    'ACTIVE': 'Đang chạy',
    'PENDING': 'Chờ duyệt',
    'PAUSED': 'Tạm dừng',
    'ENDED': 'Đã kết thúc',
    'SUCCESSFUL': 'Thành công',
    'FAILED': 'Thất bại',
  };
  return statusMap[status] || status;
}

/**
 * Get status color class
 */
export function getCampaignStatusColor(status) {
  const colorMap = {
    'DRAFT': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'PENDING': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'PAUSED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'ENDED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'SUCCESSFUL': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'FAILED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
}
