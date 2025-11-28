import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, Megaphone, TrendingUp, ArrowLeft } from 'lucide-react';
import { dashboardApi } from '@/api/dashboardApi';
import FounderStatCard from './FounderStatCard';
import FundraisingProgressChart from './FundraisingProgressChart';
import CampaignStatusDistribution from './CampaignStatusDistribution';
import TopCampaignsChart from './TopCampaignsChart';
import RecentActivities from './RecentActivities';

/**
 * Main Founder Dashboard Component
 * Displays overview statistics and charts for founder's campaigns
 */
export const FounderDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const response = await dashboardApi.getFounderDashboardData();

                if (response?.data?.data) {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error('Error loading founder dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Không có dữ liệu</p>
            </div>
        );
    }

    const { overview, trends, weeklyProgress, campaignsByStatus, topCampaigns, recentActivities } = dashboardData;

    return (
        <div className="min-h-screen bg-background-light-2 dark:bg-darker py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-container mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại Dashboard</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white">
                        Dashboard Founder
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground dark:text-text-white mt-1">
                        Tổng quan về các chiến dịch của bạn
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <FounderStatCard
                        title="Tổng gây quỹ"
                        value={formatCurrency(overview?.totalPledged || 0)}
                        icon={DollarSign}
                        trend={trends?.pledgedTrend >= 0 ? 'up' : 'down'}
                        trendValue={Math.abs(trends?.pledgedTrend || 0)}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Người ủng hộ"
                        value={(overview?.totalBackers || 0).toLocaleString('vi-VN')}
                        icon={Users}
                        trend={trends?.backersTrend >= 0 ? 'up' : 'down'}
                        trendValue={Math.abs(trends?.backersTrend || 0)}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Chiến dịch"
                        value={overview?.totalCampaigns || 0}
                        icon={Megaphone}
                        trend={trends?.campaignsTrend >= 0 ? 'up' : 'down'}
                        trendValue={Math.abs(trends?.campaignsTrend || 0)}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Tỷ lệ thành công"
                        value={`${(overview?.successRate || 0).toFixed(1)}%`}
                        icon={TrendingUp}
                        trend={trends?.successRateTrend >= 0 ? 'up' : 'down'}
                        trendValue={Math.abs(trends?.successRateTrend || 0)}
                        trendLabel="vs tuần trước"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <FundraisingProgressChart weeklyProgress={weeklyProgress} />
                    <CampaignStatusDistribution campaignsByStatus={campaignsByStatus} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <TopCampaignsChart topCampaigns={topCampaigns} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentActivities recentActivities={recentActivities} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderDashboard;
