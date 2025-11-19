import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Megaphone, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { campaignApi } from '@/api/campaignApi';
import FounderStatCard from './FounderStatCard';
import FundraisingProgressChart from './FundraisingProgressChart';
import CampaignStatusDistribution from './CampaignStatusDistribution';
import TopCampaignsChart from './TopCampaignsChart';
import RecentActivities from './RecentActivities';
import mockFounderCampaigns from '@/data/mockFounderDashboard';

/**
 * Main Founder Dashboard Component
 * Displays overview statistics and charts for founder's campaigns
 */
export const FounderDashboard = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useMockData] = useState(true); // Set to false to use real API

    useEffect(() => {
        const loadFounderCampaigns = async () => {
            try {
                setLoading(true);

                // Use mock data for UI testing
                if (useMockData) {
                    setTimeout(() => {
                        setCampaigns(mockFounderCampaigns);
                        setLoading(false);
                    }, 800); // Simulate API delay
                    return;
                }

                // Real API call
                if (!user?.userId) return;
                const response = await campaignApi.getUserCampaigns(user.userId, {
                    page: 1,
                    size: 1000,
                    sort: 'createdAt,desc',
                });

                if (response?.data?.content) {
                    setCampaigns(response.data.content);
                }
            } catch (error) {
                console.error('Error loading founder campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFounderCampaigns();
    }, [user?.userId, useMockData]);

    // Calculate stats
    const totalPledged = campaigns.reduce((sum, c) => sum + (c.pledgedAmount || 0), 0);
    const totalBackers = campaigns.reduce((sum, c) => sum + (c.backersCount || 0), 0);
    const totalCampaigns = campaigns.length;
    const successfulCampaigns = campaigns.filter((c) => c.campaignStatus === 'SUCCESSFUL').length;
    const successRate =
        totalCampaigns > 0 ? ((successfulCampaigns / totalCampaigns) * 100).toFixed(1) : 0;

    // Mock trend data (you can calculate real trends later)
    const pledgedTrend = 12.5;
    const backersTrend = 8.3;
    const campaignsTrend = 0;
    const successRateTrend = 5.2;

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

    return (
        <div className="min-h-screen bg-background-light-2 dark:bg-darker py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-container mx-auto">
                {/* Header */}
                <div className="mb-6">
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
                        value={formatCurrency(totalPledged)}
                        icon={DollarSign}
                        trend={pledgedTrend}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Người ủng hộ"
                        value={totalBackers.toLocaleString('vi-VN')}
                        icon={Users}
                        trend={backersTrend}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Chiến dịch"
                        value={totalCampaigns}
                        icon={Megaphone}
                        trend={campaignsTrend}
                        trendLabel="vs tuần trước"
                    />
                    <FounderStatCard
                        title="Tỷ lệ thành công"
                        value={`${successRate}%`}
                        icon={TrendingUp}
                        trend={successRateTrend}
                        trendLabel="vs tuần trước"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <FundraisingProgressChart campaigns={campaigns} />
                    <CampaignStatusDistribution campaigns={campaigns} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <TopCampaignsChart campaigns={campaigns} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentActivities campaigns={campaigns} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderDashboard;
