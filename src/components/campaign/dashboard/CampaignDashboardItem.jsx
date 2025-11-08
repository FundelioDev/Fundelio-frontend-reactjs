import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Get campaign status label in Vietnamese
 */
const getCampaignStatusLabel = (status) => {
    const labels = {
        DRAFT: 'Bản nháp',
        ACTIVE: 'Đang hoạt động',
        PENDING: 'Chờ duyệt',
        PAUSED: 'Tạm dừng',
        ENDED: 'Đã kết thúc',
        SUCCESSFUL: 'Thành công',
        FAILED: 'Thất bại',
    };
    return labels[status] || status;
};

/**
 * Get campaign status color classes
 */
const getCampaignStatusColor = (status) => {
    const colors = {
        DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        PAUSED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        ENDED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        SUCCESSFUL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.DRAFT;
};

/**
 * Get mock image based on category
 */
const getMockImage = (category) => {
    const mockImages = {
        art: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        games: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
        technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
        film: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop',
        food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
        fashion: 'https://images.unsplash.com/photo-1558769132-cb1aea7c8a0b?w=600&h=400&fit=crop',
        publishing: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
        photography: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
    };
    return mockImages[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop';
};

/**
 * CampaignDashboardItem - Campaign card for dashboard (horizontal layout)
 */
export default function CampaignDashboardItem({ campaign }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/campaigns/${campaign.campaignId}/edit`);
    };

    // Get owner name
    const ownerName = campaign.owner
        ? `${campaign.owner.firstName || ''} ${campaign.owner.lastName || ''}`.trim() || 'Unknown'
        : 'Unknown';

    // Mock image URL (since API doesn't have imageUrl yet)
    const imageUrl = campaign.imageUrl || getMockImage(campaign.category);

    return (
        <div
            className="group relative bg-white dark:bg-darker-2 rounded-md p-3 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/20"
        >
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                {/* Image Container */}
                <div className="w-full sm:w-64 h-48 sm:h-auto rounded-md flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = getMockImage(campaign.category);
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Status Badge */}
                    <div className="top-4 left-4">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getCampaignStatusColor(campaign.campaignStatus)}`}
                        >
                            {getCampaignStatusLabel(campaign.campaignStatus)}
                        </span>
                    </div>
                    <div>
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors">
                            {campaign.title}
                        </h3>

                        {/* Owner */}
                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                                {ownerName.charAt(0).toUpperCase()}
                            </span>
                            <span>by {ownerName}</span>
                        </p>
                    </div>

                    {/* Edit Button */}
                    <div className="flex items-center justify-end">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group/btn"
                        >
                            <span>Chỉnh sửa chiến dịch</span>
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
