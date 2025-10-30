import { mockDashboardStats, mockAdminCampaigns } from '@/data/mockAdminData';
import { Users, Megaphone, Clock, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { RecentCampaignsList } from '@/components/admin/dashboard/RecentCampaignsList';
import { QuickStats } from '@/components/admin/dashboard/QuickStats';
import { formatCurrency } from '@/utils/formatters';

export default function AdminDashboard() {
  const stats = mockDashboardStats;
  const recentCampaigns = mockAdminCampaigns.slice(0, 5);

  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Tổng người dùng'
          value={stats.totalUsers}
          icon={Users}
          trend='up'
          trendValue={stats.userGrowth}
        />
        <StatCard
          title='Tổng chiến dịch'
          value={stats.totalCampaigns}
          icon={Megaphone}
        />
        <StatCard
          title='Chờ duyệt'
          value={stats.pendingCampaigns}
          icon={Clock}
        />
        <StatCard
          title='Doanh thu'
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          trend='up'
          trendValue={stats.revenueGrowth}
        />
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RecentCampaignsList campaigns={recentCampaigns} />
        <QuickStats stats={stats} />
      </div>
    </div>
  );
}
