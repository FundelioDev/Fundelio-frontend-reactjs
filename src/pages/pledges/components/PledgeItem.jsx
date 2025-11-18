import React from 'react';
import { Users, Calendar, CalendarX, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PledgeItem({ pledge, onShowDetail }) {
    const navigate = useNavigate();
    const { campaign, rewardTitle, amount, bonusAmount, totalAmount, createdAt } = pledge;

    // Check if campaign has ended
    const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
    const hasEnded = endDate && endDate < new Date();

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value || 0) + ' VND';
    };

    const handleViewCampaign = () => {
        navigate(`/campaigns/${campaign.campaignId}`);
    };

    return (
        <li
            className={`bg-white dark:bg-darker-2 rounded-sm shadow-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 border border-transparent ${hasEnded ? 'opacity-75' : ''
                }`}
        >
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-3 sm:p-4">
                {/* Left: Campaign Info */}
                <section className="flex gap-4">
                    {/* Campaign Image */}
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-sm overflow-hidden bg-muted">
                        {campaign.introImageUrl ? (
                            <img
                                src={campaign.introImageUrl}
                                alt={campaign.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Campaign Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2 line-clamp-2">
                            {campaign.title}
                        </h3>

                        {campaign.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {campaign.description}
                            </p>
                        )}

                        {/* Campaign Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span>{campaign.backersCount || 0} người ủng hộ</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {hasEnded ? (
                                    <>
                                        <CalendarX className="w-4 h-4 text-red-500" />
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            Đã kết thúc: {formatDate(campaign.endDate)}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: Pledge Info */}
                <section className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-3">
                        {/* Reward Title */}
                        {rewardTitle && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Phần thưởng</h4>
                                <p className="text-base font-semibold text-text-primary dark:text-white">
                                    {rewardTitle}
                                </p>
                            </div>
                        )}

                        {/* Pledge Amounts */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Số tiền cam kết</p>
                                <p className="text-sm font-bold text-primary">{formatCurrency(amount)}</p>
                            </div>

                            {bonusAmount > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Tiền thưởng</p>
                                    <p className="text-sm font-bold text-secondary">{formatCurrency(bonusAmount)}</p>
                                </div>
                            )}
                        </div>

                        {/* Total Amount */}
                        <div className="bg-muted/50 dark:bg-darker rounded-sm p-3">
                            <p className="text-xs text-muted-foreground mb-1">Tổng cộng</p>
                            <p className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                        </div>

                        {/* Created Date */}
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Ngày ủng hộ: {formatDate(createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                            onClick={handleViewCampaign}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-primary hover:text-primary-600 bg-primary/5 hover:bg-primary/10 rounded-sm transition-colors"
                        >
                            Xem chiến dịch
                        </button>

                        <button
                            onClick={() => onShowDetail(pledge)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-text-primary dark:text-white hover:text-primary bg-white dark:bg-darker hover:bg-muted dark:hover:bg-darker/80 border border-border rounded-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Eye className="w-4 h-4" />
                            Chi tiết
                        </button>
                    </div>
                </section>
            </article>
        </li>
    );
}
