import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, MapPin } from 'lucide-react';
import { formatCurrency, calculateDaysLeft, calculateProgress } from '@/utils/formatters';

/**
 * SearchResults - Grid of campaign cards
 */
const SearchResults = ({ campaigns = [] }) => {
    const navigate = useNavigate();

    if (campaigns.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
                <CampaignCard key={campaign.campaignId} campaign={campaign} onClick={() => navigate(`/campaign/${campaign.campaignId}`)} />
            ))}
        </div>
    );
};

/**
 * CampaignCard - Individual campaign card
 */
const CampaignCard = ({ campaign, onClick }) => {
    const progress = calculateProgress(campaign.currentAmount, campaign.fundingGoal);
    const daysLeft = calculateDaysLeft(campaign.endDate);
    const isEnded = campaign.campaignStatus === 'ENDED' || daysLeft <= 0;

    return (
        <article
            onClick={onClick}
            className="group bg-white dark:bg-darker rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                {campaign.thumbnailUrl ? (
                    <img
                        src={campaign.thumbnailUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <Target className="w-12 h-12" />
                    </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    {campaign.campaignStatus === 'UPCOMING' ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                            Sắp diễn ra
                        </span>
                    ) : isEnded ? (
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold">
                            Đã kết thúc
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold">
                            Đang hoạt động
                        </span>
                    )}
                </div>

                {/* Category badge */}
                {campaign.categoryName && (
                    <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-darker/90 text-text text-xs font-medium backdrop-blur-sm">
                            {campaign.categoryName}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">
                    {campaign.title}
                </h3>

                {/* Description */}
                {campaign.description && (
                    <p className="text-sm text-text-secondary line-clamp-2">
                        {campaign.description}
                    </p>
                )}

                {/* Creator */}
                {campaign.creatorName && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span>bởi</span>
                        <span className="font-medium text-text">{campaign.creatorName}</span>
                    </div>
                )}

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <span className="font-bold text-text">
                                {formatCurrency(campaign.currentAmount, campaign.currency || 'VND')}
                            </span>
                            <span className="text-text-secondary ml-1">
                                / {formatCurrency(campaign.fundingGoal, campaign.currency || 'VND')}
                            </span>
                        </div>
                        <div className="text-primary font-semibold">
                            {progress.toFixed(0)}%
                        </div>
                    </div>
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{campaign.backerCount || 0} nhà hỗ trợ</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {isEnded ? 'Đã kết thúc' : `${daysLeft} ngày còn lại`}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default SearchResults;
