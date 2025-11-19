import { useState, useEffect } from 'react';
import { Users, Megaphone, Clock, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { CampaignStatusChart } from '@/components/admin/dashboard/CampaignStatusChart';
import { CategoryDistributionChart, TopFundedCampaignsChart, FounderGrowthChart, CampaignsPerformanceChart } from '@/components/admin/dashboard';
import { campaignApi } from '@/api/campaignApi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCampaigns: 0,
    pendingCampaigns: 0,
    activeCampaigns: 0,
    campaignsThisMonth: 0,
    userGrowth: 0,
    totalPledged: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all campaigns for statistics
      const campaignsResponse = await campaignApi.getAllCampaigns({
        page: 1,
        size: 1000, // Get all campaigns for stats
        sort: 'createdAt,desc',
      });

      if (campaignsResponse?.data?.data) {
        const allCampaigns = campaignsResponse.data.data.content || [];
        setCampaigns(allCampaigns);

        // Calculate stats from campaigns
        const totalCampaigns = allCampaigns.length;
        const pendingCampaigns = allCampaigns.filter(c => c.campaignStatus === 'PENDING').length;
        const activeCampaigns = allCampaigns.filter(c => c.campaignStatus === 'ACTIVE').length;

        // Calculate campaigns this month
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const campaignsThisMonth = allCampaigns.filter(c => {
          if (!c.createdAt) return false;
          const createdDate = new Date(c.createdAt);
          return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
        }).length;

        // Extract unique founder count (users who created campaigns)
        const uniqueFounders = new Set(allCampaigns.map(c => c.owner?.userId).filter(Boolean));
        const totalFounders = uniqueFounders.size;

        // Calculate total pledged amount
        const totalPledged = allCampaigns.reduce((sum, c) => sum + (c.pledgedAmount || 0), 0);

        // Calculate success rate
        const successful = allCampaigns.filter(c => c.campaignStatus === 'SUCCESSFUL').length;
        const failed = allCampaigns.filter(c => c.campaignStatus === 'FAILED').length;
        const successRate = (successful + failed) > 0
          ? ((successful / (successful + failed)) * 100).toFixed(1)
          : 0;

        setStats({
          totalUsers: totalFounders, // Using founders as proxy for users
          activeUsers: activeCampaigns, // Active campaigns as proxy for active users
          totalCampaigns,
          pendingCampaigns,
          activeCampaigns,
          campaignsThisMonth,
          userGrowth: 0, // Will be calculated from data if available
          totalPledged,
          successRate,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      {/* Stats Grid - 6 cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4'>
        <StatCard
          title='Tổng Founders'
          value={stats.totalUsers}
          icon={UserPlus}
          trend='up'
          trendValue={stats.userGrowth}
          helper='Người tạo có ít nhất 1 chiến dịch'
          accent='violet'
        />
        <StatCard
          title='Tổng chiến dịch'
          value={stats.totalCampaigns}
          icon={Megaphone}
          helper='Bao gồm mọi trạng thái'
          accent='primary'
        />
        <StatCard
          title='Chờ duyệt'
          value={stats.pendingCampaigns}
          icon={Clock}
          helper='Đang cần kiểm duyệt'
          accent='amber'
        />
        <StatCard
          title='Tổng gây quỹ'
          value={
            stats.totalPledged >= 1000000
              ? `${(stats.totalPledged / 1000000).toFixed(1)}M`
              : stats.totalPledged >= 1000
                ? `${(stats.totalPledged / 1000).toFixed(0)}K`
                : stats.totalPledged
          }
          icon={DollarSign}
          trend='up'
          trendValue={0}
          helper='Tổng số tiền đã huy động'
          accent='emerald'
        />
        <StatCard
          title='Đang hoạt động'
          value={stats.activeCampaigns}
          icon={Megaphone}
          trend='up'
          trendValue={0}
          helper='Chiến dịch ACTIVE'
          accent='slate'
        />
        <StatCard
          title='Tỷ lệ thành công'
          value={`${stats.successRate}%`}
          icon={TrendingUp}
          trend='up'
          trendValue={0}
          helper='SUCCESSFUL / (SUCCESSFUL + FAILED)'
          accent='primary'
        />
      </div>

      {/* Charts Row 1: Campaign Status & Founder Growth */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CampaignStatusChart campaigns={campaigns} />
        <FounderGrowthChart campaigns={campaigns} />
      </div>

      {/* Charts Row 2: Category Distribution & Performance */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CategoryDistributionChart campaigns={campaigns} />
        <CampaignsPerformanceChart campaigns={campaigns} />
      </div>

      {/* Charts Row 3: Top Funded Campaigns - Full Width */}
      <div className='grid grid-cols-1 gap-4'>
        <TopFundedCampaignsChart campaigns={campaigns} />
      </div>
    </div>
  );
}
