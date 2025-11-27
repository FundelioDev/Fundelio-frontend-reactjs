import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Chờ duyệt' },
    approved: { variant: 'success', label: 'Đã duyệt' },
    rejected: { variant: 'destructive', label: 'Từ chối' },
    active: { variant: 'success', label: 'Đang chạy' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const RecentCampaignsList = ({ campaigns = [] }) => {
  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className='p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Chiến dịch gần đây
        </h3>
        <div className='text-center py-8 text-muted-foreground'>
          Chưa có dữ liệu
        </div>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Card className='px-4 py-3'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          Chiến dịch gần đây
        </h3>
        <Link
          to='/admin/campaigns'
          className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
        >
          Xem tất cả →
        </Link>
      </div>
      <div className='max-h-[400px] overflow-y-scroll pr-2 space-y-4 scrollbar-primary'>
        {campaigns.map((campaign) => (
          <div
            key={campaign.campaignId}
            className='flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0'
          >
            <img
              src={campaign.thumbnail}
              alt={campaign.title}
              className='w-16 h-16 rounded-lg object-cover'
            />
            <div className='flex-1 min-w-0'>
              <Link
                to={`/admin/campaigns/${campaign.campaignId}`}
                className='text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1'
              >
                {campaign.title}
              </Link>
              <p className='text-xs text-gray-500 dark:text-text-white mt-1'>
                {campaign.creatorName}
              </p>
              <div className='flex items-center justify-between mt-2'>
                {getStatusBadge(campaign.status?.toLowerCase())}
                <span className='text-xs text-gray-500 dark:text-text-white'>
                  {formatDate(campaign.submittedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
