import React from 'react';
import { Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Recent Activities Component for Founder Dashboard
 */
export const RecentActivities = ({ campaigns = [] }) => {
    const navigate = useNavigate();

    // Get 5 most recent campaigns
    const recentCampaigns = [...campaigns]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);

    const getStatusBadge = (status) => {
        const statusConfig = {
            DRAFT: { label: 'Nháp', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
            PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
            APPROVED: { label: 'Đã duyệt', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
            ACTIVE: { label: 'Hoạt động', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
            ENDED: { label: 'Kết thúc', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
            SUCCESSFUL: { label: 'Thành công', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
            FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
        };

        const config = statusConfig[status] || statusConfig.DRAFT;
        return (
            <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        }
        if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'K';
        }
        return amount.toLocaleString('vi-VN');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (campaigns.length === 0) {
        return (
            <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
                <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                    Hoạt động gần đây
                </h3>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Chưa có hoạt động
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
            <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                Hoạt động gần đây
            </h3>

            <div className="space-y-3">
                {recentCampaigns.map((campaign) => (
                    <div
                        key={campaign.campaignId}
                        onClick={() => navigate(`/campaigns/${campaign.campaignId}/dashboard`)}
                        className="p-3 rounded-sm border border-border-light dark:border-border hover:border-primary/30 dark:hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-text-primary dark:text-white group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                {campaign.title}
                            </h4>
                            {getStatusBadge(campaign.campaignStatus)}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground dark:text-text-white">
                                <DollarSign className="w-3 h-3" />
                                <span>{formatCurrency(campaign.pledgedAmount || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground dark:text-text-white">
                                <Users className="w-3 h-3" />
                                <span>{campaign.backersCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground dark:text-text-white">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(campaign.updatedAt || campaign.createdAt)}</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2">
                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            ((campaign.pledgedAmount || 0) / (campaign.goalAmount || 1)) * 100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            {campaigns.length > 5 && (
                <button
                    onClick={() => navigate('/your-projects')}
                    className="w-full mt-3 py-2 text-xs sm:text-sm font-medium text-primary hover:text-primary-600 transition-colors"
                >
                    Xem tất cả chiến dịch →
                </button>
            )}
        </div>
    );
};

export default RecentActivities;
