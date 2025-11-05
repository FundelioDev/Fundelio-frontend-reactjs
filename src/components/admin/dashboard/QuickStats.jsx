import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export const QuickStats = ({ stats }) => {
  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
        Thống kê nhanh
      </h3>
      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg'>
          <div>
            <p className='text-sm text-gray-600 dark:text-text-white'>
              Người dùng hoạt động
            </p>
            <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {stats.activeUsers}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-500 dark:text-text-white'>
              Tổng: {stats.totalUsers}
            </p>
            <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg'>
          <div>
            <p className='text-sm text-gray-600 dark:text-text-white'>
              Chiến dịch tháng này
            </p>
            <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {stats.campaignsThisMonth}
            </p>
          </div>
          <TrendingUp className='w-8 h-8 text-green-600 dark:text-green-400' />
        </div>

        <div className='p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-sm text-gray-600 dark:text-text-white'>
              Cần xem xét
            </p>
            <Badge variant='warning'>{stats.pendingCampaigns}</Badge>
          </div>
          <Link
            to='/admin/campaigns?status=pending'
            className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'
          >
            Xem các chiến dịch chờ duyệt →
          </Link>
        </div>
      </div>
    </Card>
  );
};
