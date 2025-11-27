import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import { dashboardApi } from '@/api/dashboardApi';
import FundingProgressTimeline from './FundingProgressTimeline';
import PledgesDistributionChart from './PledgesDistributionChart';
import RecentPledgesTable from './RecentPledgesTable';
import PerformanceIndicators from './PerformanceIndicators';
import BackerPledgesSection from './BackerPledgesSection';
import {
    Users,
    TrendingUp,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    AlertCircle,
    CheckCircle,
    Activity,
    DollarSign,
    UserCheck,
    Wallet
} from 'lucide-react';

// NOTE: Hiện chưa có API analytics riêng, nên phần chart đang dùng mock data
// dựa trên campaign & rewards. Sau này có thể thay bằng endpoint chuyên biệt.

// Generate mock pledges data for testing
const generateMockPledges = (count = 25) => {
    const names = [
        'Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D',
        'Hoàng Thu E', 'Vũ Đức F', 'Đặng Hải G', 'Bùi Quỳnh H',
        'Đinh Tường I', 'Đỗ Anh J', 'Mai Phương K', 'Dương Thảo L',
        'Lý Hùng M', 'Võ Linh N', 'Phan Khoa O', 'Chu Duy P'
    ];

    const today = new Date();

    return Array.from({ length: count }, (_, idx) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);

        // Phân bố pledges theo tier
        let amount;
        const tier = Math.random();
        if (tier < 0.15) { // 15% high tier
            amount = Math.floor(Math.random() * 2000000) + 500000; // 500k-2.5M
        } else if (tier < 0.45) { // 30% medium tier
            amount = Math.floor(Math.random() * 400000) + 100000; // 100k-500k
        } else { // 55% low tier
            amount = Math.floor(Math.random() * 90000) + 10000; // 10k-100k
        }

        return {
            pledgeId: `pledge-${idx + 1}`,
            userId: `user-${Math.floor(Math.random() * 1000)}`,
            pledgeAmount: amount,
            amount: amount,
            createdAt: date.toISOString(),
            user: {
                userId: `user-${idx}`,
                firstName: names[Math.floor(Math.random() * names.length)],
            }
        };
    });
};

// Generate mock rewards data
const generateMockRewards = () => {
    return [
        {
            rewardId: 'reward-1',
            title: 'Early Bird - Gói Khởi Đầu',
            minPledgedAmount: 50000,
            backersCount: 45,
            description: 'Ưu đãi đặc biệt cho 50 người ủng hộ đầu tiên'
        },
        {
            rewardId: 'reward-2',
            title: 'Standard - Gói Tiêu Chuẩn',
            minPledgedAmount: 100000,
            backersCount: 32,
            description: 'Phần thưởng cơ bản với đầy đủ tính năng'
        },
        {
            rewardId: 'reward-3',
            title: 'Premium - Gói Cao Cấp',
            minPledgedAmount: 250000,
            backersCount: 18,
            description: 'Gói cao cấp với nhiều ưu đãi độc quyền'
        },
        {
            rewardId: 'reward-4',
            title: 'VIP - Gói Đặc Biệt',
            minPledgedAmount: 500000,
            backersCount: 8,
            description: 'Gói VIP với quyền lợi đặc biệt'
        },
        {
            rewardId: 'reward-5',
            title: 'Exclusive - Gói Giới Hạn',
            minPledgedAmount: 1000000,
            backersCount: 5,
            description: 'Phiên bản giới hạn chỉ dành cho 10 người'
        }
    ];
};

// Build Area Chart data for fundraising progress
const buildFundraisingProgressData = (campaign, pledges = []) => {
    if (!campaign) return { labels: [], datasets: [] };

    const today = new Date();
    const labels = [];
    const data = [];

    // Sử dụng goalAmount nếu currentAmount = 0 để demo
    const targetAmount = campaign.currentAmount || campaign.goalAmount || 10000000;

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

        // Simulate cumulative funding growth
        const progress = (29 - i) / 29; // 0 to 1
        const baseAmount = targetAmount * progress;
        const variance = Math.random() * targetAmount * 0.05;
        data.push(Math.max(0, Math.round(baseAmount + variance)));
    }

    console.log('📊 Area Chart Data:', { labels: labels.slice(0, 5), data: data.slice(0, 5), targetAmount });

    return {
        labels,
        datasets: [{
            label: 'Số tiền huy động (VND)',
            data,
            fill: true,
            borderColor: 'rgb(62, 202, 136)',
            backgroundColor: 'rgba(62, 202, 136, 0.2)',
            tension: 0.4,
        }]
    };
};

const formatCurrency = (value = 0, { suffix = '₫', maximumFractionDigits = 0 } = {}) => {
    const number = Number.isFinite(value) ? value : 0;
    return `${number.toLocaleString('vi-VN', { maximumFractionDigits })}${suffix ? ` ${suffix}` : ''}`.trim();
};

const formatPercent = (value, fallback = '—') => {
    if (!Number.isFinite(value)) return fallback;
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const formatRatioPercent = (value, fallback = '—') => {
    if (!Number.isFinite(value)) return fallback;
    return `${(value * 100).toFixed(0)}%`;
};

const ChartCard = ({ title, children, action }) => (
    <div className="bg-white dark:bg-darker-2 rounded-lg border border-border p-4 sm:p-6 h-full flex flex-col">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">
                {title}
            </h2>
            {action}
        </div>
        <div className="flex-1" style={{ minHeight: '320px', height: '400px' }}>
            {children}
        </div>
    </div>
);

// Stat Card với circular progress và icon
const StatCard = ({ title, value, icon: Icon, trend, trendValue, progress }) => {
    const radius = 22; // Giảm 1/2 từ 45 xuống 22
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="bg-white dark:bg-darker-2 rounded-lg border border-border p-5 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <div className="flex flex-col items-start space-y-3">
                        {Icon && (
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        <p className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white mb-2">
                            {value}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            {title}
                        </p>
                    </div>
                </div>

                {/* Circular progress - 2 layers - Giảm 1/2 kích thước */}
                <div className="flex flex-col items-center gap-2">
                    {progress !== undefined && (
                        <div>
                            <svg width="50" height="50" className="transform -rotate-90">
                                {/* Background circle */}
                                <circle
                                    cx="25"
                                    cy="25"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-gray-200 dark:text-gray-700 opacity-50"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="25"
                                    cy="25"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-primary"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Trend - Hiển thị bên dưới circle */}
                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend === 'up' ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}
                            >
                                {trend === 'up' ? '+' : ''}{trendValue}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const getPriorityStyles = (severity = 'neutral') => {
    const variants = {
        critical: {
            container: 'border-red-200 bg-red-50 dark:border-red-800/70 dark:bg-red-900/20',
            dot: 'bg-red-500'
        },
        warning: {
            container: 'border-amber-200 bg-amber-50 dark:border-amber-800/70 dark:bg-amber-900/20',
            dot: 'bg-amber-500'
        },
        info: {
            container: 'border-blue-200 bg-blue-50 dark:border-blue-800/70 dark:bg-blue-900/20',
            dot: 'bg-blue-500'
        },
        success: {
            container: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-900/20',
            dot: 'bg-emerald-500'
        },
        neutral: {
            container: 'border-border bg-gray-50 dark:bg-dark',
            dot: 'bg-gray-400'
        }
    };

    return variants[severity] || variants.neutral;
};

const FounderManagementPanel = ({ data }) => {
    if (!data) return null;
    if (!Array.isArray(data.summaryMetrics)) return null;

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-4 sm:p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Command Center</p>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">Bảng điều hành Founder</h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {Math.round(Math.min(200, Math.max(0, data.runwayCoverage || 0)))}% mục tiêu dự kiến
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.summaryMetrics.map(metric => {
                    const Icon = metric.icon;
                    const toneClass = metric.tone === 'positive'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : metric.tone === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-muted-foreground';

                    return (
                        <div key={metric.key} className="border border-border rounded-sm p-3 hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <p className="text-xl font-semibold text-text-primary dark:text-white">{metric.value}</p>
                            <p className={`text-xs mt-1 ${toneClass}`}>
                                {metric.caption}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6">
                <p className="text-sm font-semibold text-text-primary dark:text-white mb-3">
                    Ưu tiên tuần này
                </p>
                <div className="space-y-3">
                    {(Array.isArray(data.priorities) ? data.priorities : []).map((priority, idx) => {
                        const priorityStyles = getPriorityStyles(priority.severity);
                        return (
                            <div
                                key={`${priority.title}-${idx}`}
                                className={`flex items-start gap-3 rounded-sm border p-3 transition-all ${priorityStyles.container}`}
                            >
                                <span className={`w-2 h-2 rounded-full mt-1.5 ${priorityStyles.dot}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-text-primary dark:text-white">{priority.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{priority.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const CommunityInsightsPanel = ({ data }) => {
    if (!data) return null;

    const cards = [
        {
            key: 'new-backers',
            label: 'Backer mới (7 ngày)',
            value: data.newBackers7d,
            caption: 'người ủng hộ gần nhất',
            icon: Users
        },
        {
            key: 'avg-ticket',
            label: 'Avg. ticket size',
            value: formatCurrency(data.avgTicket),
            caption: 'Giá trị trung bình / pledge',
            icon: Wallet
        },
        {
            key: 'high-value',
            label: `Pledge ≥ ${(data.highValueThreshold / 1000).toFixed(0)}K`,
            value: formatRatioPercent(data.highValueShare, '0%'),
            caption: 'Tỷ trọng doanh thu từ pledge lớn',
            icon: DollarSign
        },
        {
            key: 'total-backers',
            label: 'Backer active',
            value: data.uniqueBackers,
            caption: `${data.totalPledges} pledges đang mở`,
            icon: UserCheck
        },
    ];

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-4 sm:p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Community Pulse</p>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">
                        Sức khỏe cộng đồng ủng hộ
                    </h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    Theo dõi tự động
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {cards.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.key} className="rounded-sm border border-border p-3">
                            <div className="flex items-center gap-2 mb-2">
                                {Icon && <Icon className="w-4 h-4 text-primary" />}
                                <span className="text-xs font-semibold text-muted-foreground">{card.label}</span>
                            </div>
                            <p className="text-xl font-semibold text-text-primary dark:text-white">{card.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{card.caption}</p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tỷ lệ backer quay lại</span>
                    <span className="font-semibold text-text-primary dark:text-white">
                        {formatRatioPercent(data.repeatRate || 0, '0%')}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${Math.min(100, Math.max(0, (data.repeatRate || 0) * 100))}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    {data.repeatRate < 0.15
                        ? 'Ít backer quay lại, nên gửi update hoặc ưu đãi dành riêng.'
                        : 'Backer quay lại ổn định, tiếp tục duy trì nhịp tương tác.'}
                </p>
            </div>
        </div>
    );
};

// const FulfillmentReadinessPanel = ({ data }) => {
//     if (!data) return null;

//     return (
//         <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-4 sm:p-5 shadow-card">
//             <div className="flex items-center justify-between mb-4">
//                 <div>
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground">Fulfillment</p>
//                     <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">
//                         Chuẩn bị giao phần thưởng
//                     </h3>
//                 </div>
//                 <div className="text-xs text-muted-foreground text-right">
//                     Giá trị cam kết
//                     <p className="text-sm font-semibold text-text-primary dark:text-white">
//                         {formatCurrency(data.totalCommittedValue)}
//                     </p>
//                 </div>
//             </div>

//             {data.topRewardsByRevenue.length === 0 ? (
//                 <div className="text-sm text-muted-foreground py-6 text-center">
//                     Chưa có dữ liệu phần thưởng
//                 </div>
//             ) : (
//                 <div className="space-y-3">
//                     {data.topRewardsByRevenue.map(reward => (
//                         <div key={reward.rewardId || reward.title} className="border border-border rounded-sm p-3">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-semibold text-text-primary dark:text-white">{reward.title}</p>
//                                     <p className="text-xs text-muted-foreground">
//                                         Doanh thu: {formatCurrency(reward.revenue)} · {reward.claimed} backer
//                                     </p>
//                                 </div>
//                                 {Number.isFinite(reward.totalQuantity) && (
//                                     <span className="text-xs font-medium text-muted-foreground">
//                                         Còn {reward.remaining}/{reward.totalQuantity}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="mt-6">
//                 {data.lowInventoryRewards.length > 0 ? (
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
//                             <AlertCircle className="w-4 h-4" />
//                             Reward sắp hết hàng
//                         </div>
//                         {data.lowInventoryRewards.slice(0, 3).map(reward => (
//                             <div key={`low-${reward.rewardId || reward.title}`} className="flex items-center justify-between text-xs border border-amber-200 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-900/20 rounded-sm px-3 py-2">
//                                 <span className="font-medium text-text-primary dark:text-white truncate pr-2">{reward.title}</span>
//                                 <span className="text-amber-600 dark:text-amber-400">
//                                     {reward.remaining} còn lại ({formatRatioPercent(reward.remainingRatio || 0)})
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/70 rounded-sm px-3 py-2">
//                         <CheckCircle className="w-4 h-4" />
//                         Tồn kho phần thưởng đang an toàn.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

export default function CampaignStatisticsPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fromAdmin = searchParams.get('fromAdmin') === 'true';
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (!campaignId) return;

                const response = await dashboardApi.getCampaignDashboardData(campaignId);

                if (response?.data?.data) {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error('Error loading campaign statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [campaignId]);

    // Use founderOps from API if provided, otherwise calculate
    // This must be called before any early returns to maintain hook order
    const founderOpsData = useMemo(() => {
        if (!dashboardData) return null;

        const { campaign, metrics, fundingTimeline, pledgesDistribution, pledges, topBackers, performanceIndicators, founderOps } = dashboardData;
        if (founderOps) {
            // Map API data to component format
            return {
                summaryMetrics: [
                    {
                        key: 'weekly-cash',
                        label: 'Dòng tiền 7 ngày',
                        value: formatCurrency(founderOps.summaryMetrics?.weeklyCash || 0),
                        caption: `${formatPercent(founderOps.summaryMetrics?.weeklyTrend || 0)} vs tuần trước`,
                        tone: (founderOps.summaryMetrics?.weeklyTrend || 0) >= 0 ? 'positive' : 'warning',
                        icon: Wallet
                    },
                    {
                        key: 'projection',
                        label: 'Dự báo cuối kỳ',
                        value: formatCurrency(founderOps.summaryMetrics?.projectedAmount || 0),
                        caption: campaign?.goalAmount > 0 ? `${Math.round(Math.min(200, Math.max(0, founderOps.summaryMetrics?.runwayCoverage || 0)))}% mục tiêu` : 'Chưa thiết lập mục tiêu',
                        tone: (founderOps.summaryMetrics?.runwayCoverage || 0) >= 100 ? 'positive' : 'warning',
                        icon: TrendingUp
                    },
                    {
                        key: 'gap',
                        label: 'Khoảng cách đến mục tiêu',
                        value: (founderOps.summaryMetrics?.gapToGoal || 0) <= 0 ? 'Đã đạt' : formatCurrency(founderOps.summaryMetrics?.gapToGoal || 0),
                        caption: (founderOps.summaryMetrics?.daysLeft || 0) > 0 ? `${founderOps.summaryMetrics.daysLeft} ngày còn lại` : 'Đang khóa sổ chiến dịch',
                        tone: (founderOps.summaryMetrics?.gapToGoal || 0) <= 0 ? 'positive' : 'warning',
                        icon: Target
                    },
                    {
                        key: 'velocity',
                        label: 'Tốc độ huy động',
                        value: `${formatCurrency(founderOps.summaryMetrics?.avgDaily || 0)} /ngày`,
                        caption: (founderOps.summaryMetrics?.requiredDaily || 0) > 0 ? `Cần ${formatCurrency(founderOps.summaryMetrics.requiredDaily)} /ngày để đạt mục tiêu` : 'Đã vượt ngưỡng cần thiết',
                        tone: (founderOps.summaryMetrics?.requiredDaily || 0) === 0 || (founderOps.summaryMetrics?.avgDaily || 0) >= (founderOps.summaryMetrics?.requiredDaily || 0) ? 'positive' : 'warning',
                        icon: Activity
                    },
                ],
                priorities: founderOps.priorities || [],
                runwayCoverage: founderOps.summaryMetrics?.runwayCoverage || 0,
                communityMetrics: founderOps.communityMetrics || {}
            };
        }

        // Fallback: calculate from data
        const uniqueBackers = new Set((pledges || []).map(p => p.userId || p.user?.userId)).size;
        if (!campaign) return null;

        // Calculate missing variables from pledges
        const totalPledges = (pledges || []).length;
        const totalPledgedAmount = (pledges || []).reduce((sum, p) => sum + (p.pledgeAmount || p.amount || 0), 0);
        const avgPledgeAmount = totalPledges > 0 ? totalPledgedAmount / totalPledges : 0;
        const rewards = campaign.rewards || [];

        const now = new Date();
        const msInDay = 1000 * 60 * 60 * 24;
        const goalAmount = campaign.goalAmount || 0;
        const pledgedAmount = campaign.currentAmount ?? campaign.pledgedAmount ?? totalPledgedAmount;
        const startDate = campaign.startDate ? new Date(campaign.startDate) : null;
        const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
        const defaultDuration = pledges.length > 0 && pledges[pledges.length - 1]?.createdAt
            ? Math.max(1, Math.ceil(Math.abs(now - new Date(pledges[pledges.length - 1].createdAt)) / msInDay))
            : 30;
        const daysElapsed = startDate
            ? Math.max(1, Math.ceil((now - startDate) / msInDay))
            : defaultDuration;
        const daysLeft = endDate ? Math.max(0, Math.ceil((endDate - now) / msInDay)) : 0;
        const avgDaily = pledgedAmount / Math.max(1, daysElapsed);
        const gapToGoal = Math.max(goalAmount - pledgedAmount, 0);
        const requiredDaily = daysLeft > 0 ? gapToGoal / daysLeft : 0;
        const projectedAmount = daysLeft > 0 ? avgDaily * (daysElapsed + daysLeft) : pledgedAmount;
        const runwayCoverage = goalAmount ? (projectedAmount / goalAmount) * 100 : 0;

        const last7Start = new Date(now);
        last7Start.setDate(now.getDate() - 6);
        const prev7Start = new Date(last7Start);
        prev7Start.setDate(last7Start.getDate() - 7);

        const sumByAmount = (list = []) => list.reduce((sum, pledge) => sum + (pledge.pledgeAmount || pledge.amount || 0), 0);

        const last7Pledges = pledges.filter(p => p.createdAt && new Date(p.createdAt) >= last7Start);
        const prev7Pledges = pledges.filter(p => {
            if (!p.createdAt) return false;
            const date = new Date(p.createdAt);
            return date >= prev7Start && date < last7Start;
        });

        const last7Total = sumByAmount(last7Pledges);
        const prev7Total = sumByAmount(prev7Pledges);
        const weeklyTrend = prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total) * 100 : null;

        const last7Backers = new Set(last7Pledges.map(p => p.userId || p.user?.userId).filter(Boolean));
        const newBackers7d = last7Backers.size;

        const highValueThreshold = 500000;
        const highValueAmount = pledges.reduce((sum, pledge) => {
            const amount = pledge.pledgeAmount || pledge.amount || 0;
            return sum + (amount >= highValueThreshold ? amount : 0);
        }, 0);
        const highValueShare = totalPledgedAmount > 0 ? highValueAmount / totalPledgedAmount : 0;

        const rewardStatuses = (rewards || []).map(reward => {
            const totalQuantity = reward.quantity ?? reward.maxQuantity ?? reward.availableQuantity ?? null;
            const claimed = reward.backersCount || 0;
            const minAmount = reward.minPledgedAmount ?? reward.price ?? reward.amount ?? 0;
            const remaining = Number.isFinite(totalQuantity) ? Math.max(totalQuantity - claimed, 0) : null;
            const remainingRatio = Number.isFinite(totalQuantity) && totalQuantity > 0
                ? remaining / totalQuantity
                : null;
            return {
                rewardId: reward.rewardId || reward.id,
                title: reward.title || 'Phần thưởng',
                claimed,
                totalQuantity,
                remaining,
                remainingRatio,
                minAmount,
                revenue: minAmount * claimed
            };
        });

        const lowInventoryRewards = rewardStatuses.filter(status =>
            Number.isFinite(status.totalQuantity) &&
            status.totalQuantity > 0 &&
            status.remainingRatio !== null &&
            status.remainingRatio <= 0.3
        );

        const topRewardsByRevenue = [...rewardStatuses]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3);

        const totalCommittedValue = rewardStatuses.reduce((sum, status) => sum + status.revenue, 0);

        const priorities = [];
        if (requiredDaily > 0 && avgDaily < requiredDaily) {
            priorities.push({
                title: 'Tốc độ gây quỹ chưa đạt',
                description: `Thiếu khoảng ${formatCurrency(Math.max(requiredDaily - avgDaily, 0))} mỗi ngày để bắt kịp mục tiêu`,
                severity: 'critical'
            });
        }
        if (lowInventoryRewards.length > 0) {
            priorities.push({
                title: 'Chuẩn bị fulfilment',
                description: `${lowInventoryRewards.length} phần thưởng còn dưới 30% số lượng`,
                severity: 'warning'
            });
        }
        if (newBackers7d < Math.max(5, uniqueBackers * 0.05)) {
            priorities.push({
                title: 'Kích hoạt backer mới',
                description: 'Lượng backer mới trong 7 ngày thấp, nên lên kế hoạch cập nhật/PR',
                severity: 'info'
            });
        }
        if (priorities.length === 0) {
            priorities.push({
                title: 'Chỉ số ổn định',
                description: 'Các luồng vận hành đều trong ngưỡng an toàn. Tiếp tục duy trì nhịp cập nhật.',
                severity: 'success'
            });
        }

        const summaryMetrics = [
            {
                key: 'weekly-cash',
                label: 'Dòng tiền 7 ngày',
                value: formatCurrency(last7Total),
                caption: weeklyTrend === null ? 'Chưa đủ dữ liệu để so sánh' : `${formatPercent(weeklyTrend)} vs tuần trước`,
                tone: weeklyTrend === null ? 'neutral' : weeklyTrend >= 0 ? 'positive' : 'warning',
                icon: Wallet
            },
            {
                key: 'projection',
                label: 'Dự báo cuối kỳ',
                value: formatCurrency(projectedAmount),
                caption: goalAmount > 0 ? `${Math.round(Math.min(200, Math.max(0, runwayCoverage)))}% mục tiêu` : 'Chưa thiết lập mục tiêu',
                tone: runwayCoverage >= 100 ? 'positive' : 'warning',
                icon: TrendingUp
            },
            {
                key: 'gap',
                label: 'Khoảng cách đến mục tiêu',
                value: gapToGoal <= 0 ? 'Đã đạt' : formatCurrency(gapToGoal),
                caption: daysLeft > 0 ? `${daysLeft} ngày còn lại` : 'Đang khóa sổ chiến dịch',
                tone: gapToGoal <= 0 ? 'positive' : 'warning',
                icon: Target
            },
            {
                key: 'velocity',
                label: 'Tốc độ huy động',
                value: `${formatCurrency(avgDaily)} /ngày`,
                caption: requiredDaily > 0 ? `Cần ${formatCurrency(requiredDaily)} /ngày để đạt mục tiêu` : 'Đã vượt ngưỡng cần thiết',
                tone: requiredDaily === 0 || avgDaily >= requiredDaily ? 'positive' : 'warning',
                icon: Activity
            },
        ];

        return {
            summaryMetrics,
            priorities,
            runwayCoverage,
            communityMetrics: {
                avgTicket: avgPledgeAmount,
                repeatRate: totalPledges > 0 ? (totalPledges - uniqueBackers) / totalPledges : 0,
                newBackers7d,
                highValueShare,
                highValueThreshold,
                totalPledges,
                uniqueBackers,
                highValueAmount,
                last7Total
            },
            fulfillmentMetrics: {
                totalCommittedValue,
                lowInventoryRewards,
                topRewardsByRevenue
            }
        };
    }, [dashboardData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Đang tải...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <p className="text-muted-foreground">Không có dữ liệu</p>
                </main>
            </div>
        );
    }

    const { campaign, metrics, fundingTimeline, pledgesDistribution, pledges, topBackers, performanceIndicators, founderOps } = dashboardData;

    // Chart options
    const areaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'rgb(107, 114, 128)', // gray-500
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')} VND`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ngày',
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: true,
                    color: 'rgba(229, 231, 235, 0.5)' // gray-200 with opacity
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Số tiền (VND)',
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    callback: (value) => {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                        return value;
                    }
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)'
                }
            }
        }
    };

    // Calculate campaign stats from API data
    const currency = campaign?.currency || 'VND';
    const pledged = campaign?.pledgedAmount || campaign?.currentAmount || 0;
    const goal = campaign?.goalAmount || 1;
    const backersCount = campaign?.backersCount || 0;
    const progressPercent = metrics?.progressPercent || 0;

    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-24 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
                    {/* Page header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white uppercase tracking-wide">
                                THỐNG KÊ CHIẾN DỊCH
                            </h1>
                            <p className="text-primary mt-1">Tổng quan về hiệu suất chiến dịch của bạn</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(fromAdmin ? '/admin/campaigns' : `/campaigns/${campaignId}/dashboard`)}
                                className="gap-2"
                            >
                                {fromAdmin ? 'Về Admin' : 'Quay lại'}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => { }}
                                className="gap-2"
                            >
                                <Download className="w-4 h-4" />
                                TẢI BÁO CÁO
                            </Button>
                        </div>
                    </div>

                    {/* Stat cards - Row 1: Main Metrics from Backend */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Mục tiêu gây quỹ"
                            value={goal >= 1000000
                                ? `${(goal / 1000000).toFixed(1)}M`
                                : `${(goal / 1000).toFixed(0)}K`
                            }
                            icon={Target}
                            progress={100}
                        />
                        <StatCard
                            title="Đã huy động"
                            value={pledged >= 1000000
                                ? `${(pledged / 1000000).toFixed(1)}M`
                                : `${(pledged / 1000).toFixed(0)}K`
                            }
                            icon={DollarSign}
                            progress={progressPercent}
                        />
                        <StatCard
                            title="Người ủng hộ"
                            value={backersCount.toLocaleString()}
                            icon={UserCheck}
                            progress={Math.min(100, (backersCount / Math.max(1, backersCount)) * 100)}
                        />
                        <StatCard
                            title="Tiến độ"
                            value={`${progressPercent}%`}
                            icon={TrendingUp}
                            progress={progressPercent}
                        />
                    </div>                    {/* Main content - 2 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Fundraising Progress Area Chart (large) */}
                        <div className="lg:col-span-2">
                            <FundingProgressTimeline fundingTimeline={fundingTimeline} campaign={campaign} />
                        </div>

                        {/* Right: Top Backers from API */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-3 shadow-card h-full flex flex-col">
                                <h2 className="text-base font-semibold text-text-primary dark:text-white mb-3">
                                    🏆 Top Backers
                                </h2>
                                <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
                                    {topBackers.length === 0 ? (
                                        <div className="text-sm text-muted-foreground text-center py-8">
                                            Chưa có dữ liệu top backers
                                        </div>
                                    ) : (
                                        topBackers.slice(0, 5).map((backer, idx) => {
                                            const totalAmount = backer.totalPledged || 0;
                                            const pledgeCount = backer.pledgeCount || backer.totalPledges || 1;
                                            const userName = backer.backerName || 'Ẩn danh';
                                            return (
                                                <div
                                                    key={backer.userId || idx}
                                                    className="flex items-center gap-1.5 py-3 border-b border-border last:border-0"
                                                >
                                                    {/* Rank Badge */}
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                        idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                                            idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                                                                'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                                        }`}>
                                                        {idx + 1}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-primary truncate">
                                                            {userName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {pledgeCount} lần ủng hộ
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm">
                                                            {totalAmount >= 1000000
                                                                ? `${(totalAmount / 1000000).toFixed(1)}M`
                                                                : totalAmount >= 1000
                                                                    ? `${(totalAmount / 1000).toFixed(0)}K`
                                                                    : `${totalAmount.toLocaleString('vi-VN')}`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Pledges Distribution + Performance Indicators */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PledgesDistributionChart pledgesDistribution={pledgesDistribution} />
                        <PerformanceIndicators performanceIndicators={performanceIndicators} campaign={campaign} />
                    </div>

                    {/* Row 3: Recent Pledges Table (full width) */}
                    <RecentPledgesTable pledges={pledges || []} />

                    {founderOpsData && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FounderManagementPanel data={founderOpsData} />
                            <CommunityInsightsPanel data={founderOpsData.communityMetrics} />
                        </div>
                    )}

                    {/* Backer Pledges Section - for shipping rewards */}
                    <BackerPledgesSection campaignId={campaignId} />

                    {/* {founderOpsData && (
                        <div className="grid grid-cols-1 gap-6">
                            <FulfillmentReadinessPanel data={founderOpsData.fulfillmentMetrics} />
                        </div>
                    )} */}
                </div>
            </main>
        </div>
    );
}
