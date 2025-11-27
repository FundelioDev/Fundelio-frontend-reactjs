import { useState, useEffect } from 'react';
import { Users, Megaphone, Clock, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { CampaignStatusChart } from '@/components/admin/dashboard/CampaignStatusChart';
import { CategoryDistributionChart, TopFundedCampaignsChart, FounderGrowthChart, CampaignsPerformanceChart, RecentCampaignsList } from '@/components/admin/dashboard';
import { dashboardApi } from '@/api/dashboardApi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardApi.getAdminDashboardData();

      if (response?.data?.data) {
        setDashboardData(response.data.data);
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

  if (!dashboardData) {
    return (
      <div className='flex items-center justify-center h-96'>
        <p className='text-muted-foreground'>Không có dữ liệu</p>
      </div>
    );
  }

  const { overview, trends, campaignsByStatus, campaignsByCategory, topFundedCampaigns, recentCampaigns, userGrowth, founderGrowth, campaignsPerformance } = dashboardData;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount;
  };

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      {/* Stats Grid - 6 cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4'>
        <StatCard
          title='Tổng Founders'
          value={overview?.totalFounders || 0}
          icon={UserPlus}
          trend={trends?.foundersGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(trends?.foundersGrowth || 0)}
          helper='Người tạo có ít nhất 1 chiến dịch'
          accent='violet'
        />
        <StatCard
          title='Tổng chiến dịch'
          value={overview?.totalCampaigns || 0}
          icon={Megaphone}
          trend={trends?.campaignsGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(trends?.campaignsGrowth || 0)}
          helper='Bao gồm mọi trạng thái'
          accent='primary'
        />
        <StatCard
          title='Chờ duyệt'
          value={overview?.pendingCampaigns || 0}
          icon={Clock}
          helper='Đang cần kiểm duyệt'
          accent='amber'
        />
        <StatCard
          title='Tổng gây quỹ'
          value={formatCurrency(overview?.totalPledged || 0)}
          icon={DollarSign}
          trend={trends?.pledgedGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(trends?.pledgedGrowth || 0)}
          helper='Tổng số tiền đã huy động'
          accent='emerald'
        />
        <StatCard
          title='Đang hoạt động'
          value={overview?.activeCampaigns || 0}
          icon={Megaphone}
          helper='Chiến dịch ACTIVE'
          accent='slate'
        />
        <StatCard
          title='Tỷ lệ thành công'
          value={`${(overview?.successRate || 0).toFixed(1)}%`}
          icon={TrendingUp}
          helper='SUCCESSFUL / (SUCCESSFUL + FAILED)'
          accent='primary'
        />
      </div>

      {/* Charts Row 1: Campaign Status & Founder Growth */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CampaignStatusChart campaignsByStatus={campaignsByStatus} />
        <FounderGrowthChart founderGrowth={founderGrowth} />
      </div>

      {/* Charts Row 2: Category Distribution & Performance */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CategoryDistributionChart campaignsByCategory={campaignsByCategory} />
        <CampaignsPerformanceChart campaignsPerformance={campaignsPerformance} />
      </div>

      {/* Charts Row 3: Top Funded Campaigns & Recent Campaigns */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2'>
          <TopFundedCampaignsChart topFundedCampaigns={topFundedCampaigns} />
        </div>
        <div className='lg:col-span-1'>
          <RecentCampaignsList campaigns={recentCampaigns} />
        </div>
      </div>
    </div>
  );
}
