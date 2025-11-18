import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import { campaignApi } from '@/api/campaignApi';
import { rewardApi } from '@/api/rewardApi';
import { pledgeApi } from '@/api/pledgeApi';
import {
    Mail,
    ShoppingCart,
    Users,
    TrendingUp,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    AlertCircle,
    CheckCircle,
    Clock,
    Activity,
    DollarSign,
    UserCheck,
    Wallet
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

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
};// Build reward performance bar data
const buildRewardBarData = (rewards = []) => {
    if (!rewards || rewards.length === 0) return { labels: [], datasets: [] };

    const sortedRewards = [...rewards]
        .sort((a, b) => (b.backersCount || 0) - (a.backersCount || 0))
        .slice(0, 5);

    return {
        labels: sortedRewards.map(r => {
            const title = r.title || 'Unknown';
            return title.length > 20 ? title.substring(0, 17) + '...' : title;
        }),
        datasets: [{
            label: 'Số người ủng hộ',
            data: sortedRewards.map(r => r.backersCount || 0),
            backgroundColor: [
                'rgba(62, 202, 136, 0.8)',
                'rgba(37, 99, 235, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
        }]
    };
};

// Calculate campaign health status
// Căn cứ:
// 1. Progress %: Đã đạt bao nhiêu % mục tiêu
// 2. Days Left: Còn bao nhiêu ngày
// 3. Velocity: Tốc độ gây quỹ hiện tại vs tốc độ cần thiết
//    - Current Velocity = Tiền đã huy động / Số ngày đã chạy
//    - Required Velocity = Tiền còn thiếu / Số ngày còn lại
//    - Nếu currentVelocity >= requiredVelocity * 0.8 → Tốt (đang on track)
const calculateCampaignHealth = (campaign, pledges = []) => {
    if (!campaign) return { status: 'unknown', message: '', color: 'gray' };

    const goalAmount = campaign.goalAmount || 1;
    const currentAmount = campaign.currentAmount || 0;
    const progressPercent = (currentAmount / goalAmount) * 100;

    const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
    const today = new Date();
    const daysLeft = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : 0;

    // Calculate velocity
    const startDate = campaign.startDate ? new Date(campaign.startDate) : new Date();
    const daysPassed = Math.max(1, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)));
    const currentVelocity = currentAmount / daysPassed;
    const requiredVelocity = daysLeft > 0 ? (goalAmount - currentAmount) / daysLeft : 0;

    if (progressPercent >= 100) {
        return {
            status: 'Đạt mục tiêu',
            message: 'Chiến dịch đã đạt mục tiêu gây quỹ!',
            color: 'green',
            icon: CheckCircle
        };
    }

    if (daysLeft <= 0) {
        return {
            status: 'Đã kết thúc',
            message: progressPercent >= 80
                ? 'Chiến dịch gần đạt mục tiêu'
                : 'Chiến dịch chưa đạt mục tiêu',
            color: progressPercent >= 80 ? 'yellow' : 'red',
            icon: Clock
        };
    }

    if (daysLeft <= 7 && progressPercent < 70) {
        return {
            status: 'Cần chú ý',
            message: `Còn ${daysLeft} ngày, cần tăng tốc để đạt mục tiêu`,
            color: 'orange',
            icon: AlertCircle
        };
    }

    if (currentVelocity >= requiredVelocity * 0.8) {
        return {
            status: 'Tốt',
            message: 'Chiến dịch đang phát triển ổn định',
            color: 'green',
            icon: TrendingUp
        };
    }

    return {
        status: 'Trung bình',
        message: 'Chiến dịch cần thêm sự quan tâm',
        color: 'blue',
        icon: Activity
    };
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

export default function CampaignStatisticsPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [pledges, setPledges] = useState([]);
    const [topBackers, setTopBackers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (!campaignId) return;

                const [campaignRes, rewardsRes, pledgesRes, backersRes] = await Promise.all([
                    campaignApi.getCampaignById(campaignId),
                    rewardApi.getRewardsWithItems(campaignId),
                    pledgeApi.getPledgeByCampaign(campaignId).catch(() => ({ data: { data: [] } })),
                    pledgeApi.getTopBackersOfCampaign(campaignId).catch(() => ({ data: { data: [] } })),
                ]);

                if (campaignRes?.data?.data) {
                    setCampaign(campaignRes.data.data);
                }

                // Rewards: sử dụng mock nếu API trả về rỗng
                if (rewardsRes?.data?.data?.content && rewardsRes.data.data.content.length > 0) {
                    setRewards(rewardsRes.data.data.content);
                } else {
                    console.log('📊 Using mock rewards data');
                    setRewards(generateMockRewards());
                }

                // ALWAYS use mock rewards for demo purposes
                console.log('📊 Force using mock rewards data for bar chart demo');
                setRewards(generateMockRewards());

                // Pledges: sử dụng mock nếu API trả về rỗng
                if (pledgesRes?.data?.data) {
                    const pledgeData = Array.isArray(pledgesRes.data.data)
                        ? pledgesRes.data.data
                        : pledgesRes.data.data.content || [];

                    if (pledgeData.length > 0) {
                        setPledges(pledgeData);
                    } else {
                        console.log('📊 Using mock pledges data');
                        setPledges(generateMockPledges(25));
                    }
                } else {
                    console.log('📊 Using mock pledges data (no API response)');
                    setPledges(generateMockPledges(25));
                }

                // Top Backers: API response
                if (backersRes?.data?.data) {
                    const backersData = Array.isArray(backersRes.data.data)
                        ? backersRes.data.data
                        : backersRes.data.data.content || [];
                    setTopBackers(backersData);
                } else {
                    setTopBackers([]);
                }
            } catch (error) {
                console.error('Error loading campaign statistics:', error);
                // Fallback to mock data on error
                console.log('📊 Using all mock data due to error');
                setRewards(generateMockRewards());
                setPledges(generateMockPledges(25));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [campaignId]);

    // Chart data
    const fundraisingProgressData = useMemo(() =>
        buildFundraisingProgressData(campaign, pledges),
        [campaign, pledges]
    );

    const rewardBarData = useMemo(() =>
        buildRewardBarData(rewards),
        [rewards]
    );

    const campaignHealth = useMemo(() =>
        calculateCampaignHealth(campaign, pledges),
        [campaign, pledges]
    );

    // Calculate stats
    const totalPledges = pledges.length;
    const totalPledgedAmount = pledges.reduce((sum, p) => sum + (p.pledgeAmount || p.amount || 0), 0);
    const avgPledgeAmount = pledges.length > 0 ? totalPledgedAmount / pledges.length : 0;

    // Calculate unique backers from pledges
    const uniqueBackers = new Set(pledges.map(p => p.userId || p.user?.userId)).size;

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

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `Số người: ${context.parsed.x}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Số người ủng hộ',
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: 'rgb(107, 114, 128)'
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)'
                },
                beginAtZero: true
            },
            y: {
                title: {
                    display: true,
                    text: 'Phần thưởng',
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: 'rgb(107, 114, 128)'
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Đang tải thống kê chiến dịch...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">Không tìm thấy chiến dịch</p>
                        <Button onClick={() => navigate('/dashboard')} className="mt-4">
                            Quay lại Dashboard
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    // Calculate campaign stats (only after campaign is loaded)
    const currency = campaign.currency || 'VND';
    const pledged = campaign.currentAmount ?? campaign.pledged ?? 0;
    const goal = campaign.goalAmount || campaign.goal || 1;
    const backersCount = campaign.backerCount ?? campaign.backers ?? 0;
    const progressPercent = Math.min(100, Math.round((pledged / goal) * 100));

    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-20 pb-10">
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
                                onClick={() => navigate(`/campaigns/${campaignId}/dashboard`)}
                                className="gap-2"
                            >
                                Quay lại
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

                    {/* Stat cards - 4 cards in a row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Tổng cam kết"
                            value={totalPledges.toLocaleString()}
                            icon={Target}
                            progress={Math.min(100, (totalPledges / 100) * 100)}
                        />
                        <StatCard
                            title="Số tiền đã huy động"
                            value={totalPledgedAmount >= 1000000
                                ? `${(totalPledgedAmount / 1000000).toFixed(1)}M`
                                : `${(totalPledgedAmount / 1000).toFixed(0)}K`
                            }
                            icon={DollarSign}
                            progress={progressPercent}
                        />
                        <StatCard
                            title="Nhà tài trợ"
                            value={uniqueBackers.toLocaleString()}
                            icon={UserCheck}
                            progress={Math.min(100, (uniqueBackers / 50) * 100)}
                        />
                        <StatCard
                            title="Trung bình/người"
                            value={avgPledgeAmount >= 1000000
                                ? `${(avgPledgeAmount / 1000000).toFixed(1)}M`
                                : `${(avgPledgeAmount / 1000).toFixed(0)}K`
                            }
                            icon={Wallet}
                            progress={Math.min(100, (avgPledgeAmount / 500000) * 100)}
                        />
                    </div>                    {/* Main content - 2 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Fundraising Progress Area Chart (large) */}
                        <div className="lg:col-span-2">
                            <ChartCard
                                title="Tiến độ gây quỹ theo thời gian"
                                action={
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-primary">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                }
                            >
                                <Line data={fundraisingProgressData} options={areaChartOptions} />
                            </ChartCard>
                        </div>

                        {/* Right: Top Backers from API */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-darker-2 rounded-lg border border-border p-4 sm:p-6 h-full flex flex-col">
                                <h2 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-4">
                                    Top Backers
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
                                                    className="flex items-center gap-3 py-3 border-b border-border last:border-0"
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
                                                                ? `${(totalAmount / 1000000).toFixed(1)}M VND`
                                                                : totalAmount >= 1000
                                                                    ? `${(totalAmount / 1000).toFixed(0)}K VND`
                                                                    : `${totalAmount.toLocaleString('vi-VN')} VND`
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

                    {/* Bottom row - 3 new relevant sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 1. Reward Performance Bar Chart */}
                        <div className="lg:col-span-1">
                            <ChartCard title="Hiệu suất phần thưởng">
                                {!rewardBarData.labels || rewardBarData.labels.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu phần thưởng
                                    </div>
                                ) : (
                                    <Bar data={rewardBarData} options={barChartOptions} />
                                )}
                            </ChartCard>
                        </div>

                        {/* 2. Campaign Health Status */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-darker-2 rounded-lg border border-border p-6 h-full">
                                <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                                    Tình trạng chiến dịch
                                </h2>
                                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                                    {campaignHealth.icon && (
                                        <campaignHealth.icon
                                            className={`w-16 h-16 mb-4 ${campaignHealth.color === 'green' ? 'text-green-500' :
                                                campaignHealth.color === 'yellow' ? 'text-yellow-500' :
                                                    campaignHealth.color === 'orange' ? 'text-orange-500' :
                                                        campaignHealth.color === 'red' ? 'text-red-500' :
                                                            'text-blue-500'
                                                }`}
                                        />
                                    )}
                                    <h3 className={`text-xl font-bold mb-2 ${campaignHealth.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                        campaignHealth.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                            campaignHealth.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                                campaignHealth.color === 'red' ? 'text-red-600 dark:text-red-400' :
                                                    'text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {campaignHealth.status}
                                    </h3>
                                    <p className="text-sm text-center text-muted-foreground">
                                        {campaignHealth.message}
                                    </p>
                                    <div className="mt-6 w-full">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Tiến độ</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${campaignHealth.color === 'green' ? 'bg-green-500' :
                                                    campaignHealth.color === 'yellow' ? 'bg-yellow-500' :
                                                        campaignHealth.color === 'orange' ? 'bg-orange-500' :
                                                            campaignHealth.color === 'red' ? 'bg-red-500' :
                                                                'bg-blue-500'
                                                    }`}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Campaign Milestones & Goals */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-darker-2 rounded-lg border border-border p-6 h-full">
                                <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                                    🎯 Mục tiêu & Tiến độ
                                </h2>
                                <div className="space-y-6">
                                    {/* Goal Progress */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Mục tiêu gây quỹ</span>
                                            <span className="font-semibold text-text-primary dark:text-white">
                                                {goal.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Đã đạt được</span>
                                            <span className="font-bold text-primary">
                                                {pledged.toLocaleString('vi-VN')} đ ({progressPercent}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                            <div
                                                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Time Progress */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Thời gian chiến dịch</span>
                                            <span className="font-semibold text-text-primary dark:text-white">
                                                {campaign.endDate
                                                    ? `${Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} ngày còn lại`
                                                    : 'Không giới hạn'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Tổng cam kết</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {totalPledges}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Nhà tài trợ</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {uniqueBackers}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Phần thưởng</p>
                                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                {rewards.length}
                                            </p>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">TB/người</p>
                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                {(avgPledgeAmount / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
