import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, Clock, Users, Target, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Chờ duyệt', icon: Clock },
    approved: { variant: 'success', label: 'Đã duyệt', icon: Check },
    rejected: { variant: 'destructive', label: 'Từ chối', icon: X },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className='flex items-center gap-1'>
      <Icon className='w-3 h-3' />
      {config.label}
    </Badge>
  );
};

export const CampaignCard = ({ campaign, onViewDetail }) => {
  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <img
        src={campaign.thumbnail}
        alt={campaign.title}
        className='w-full h-48 object-cover'
      />
      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between'>
          <h3 className='font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 flex-1'>
            {campaign.title}
          </h3>
          {getStatusBadge(campaign.status)}
        </div>

        <div className='space-y-2 text-sm text-gray-600 dark:text-text-white'>
          <div className='flex items-center'>
            <Users className='w-4 h-4 mr-2' />
            <span>{campaign.creator}</span>
          </div>
          <div className='flex items-center'>
            <Target className='w-4 h-4 mr-2' />
            <span>{formatCurrency(campaign.targetAmount)}</span>
          </div>
          <div className='flex items-center'>
            <Calendar className='w-4 h-4 mr-2' />
            <span>Nộp: {campaign.submittedAt}</span>
          </div>
        </div>

        {campaign.status === 'approved' && (
          <div className='pt-2 border-t dark:border-gray-700'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600 dark:text-text-white'>Đã đạt:</span>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                {formatCurrency(campaign.currentAmount)}
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-blue-600 dark:bg-blue-500 h-2 rounded-full'
                style={{
                  width: `${Math.min(
                    (campaign.currentAmount / campaign.targetAmount) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        <Button
          variant='outline'
          className='w-full'
          onClick={() => onViewDetail(campaign)}
        >
          <Eye className='w-4 h-4 mr-2' />
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
};
