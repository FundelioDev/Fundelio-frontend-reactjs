import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, Clock, Users, Target, Calendar, CheckCircle, XCircle, Loader, TrendingUp, TrendingDown, Ban, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const getStatusBadge = (status) => {
  const statusConfig = {
    DRAFT: { variant: 'secondary', label: 'Bản nháp', icon: FileText },
    PENDING: { variant: 'warning', label: 'Chờ duyệt', icon: Clock },
    APPROVED: { variant: 'success', label: 'Đã duyệt', icon: Check },
    REJECTED: { variant: 'destructive', label: 'Từ chối', icon: X },
    ACTIVE: { variant: 'default', label: 'Đang gây quỹ', icon: Loader },
    SUCCESSFUL: { variant: 'success', label: 'Thành công', icon: TrendingUp },
    FAILED: { variant: 'destructive', label: 'Thất bại', icon: TrendingDown },
    ENDED: { variant: 'destructive', label: 'Kết thúc', icon: Ban },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className='flex items-center gap-1'>
      <Icon className='w-3 h-3' />
      {config.label}
    </Badge>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    let date;

    // Handle format: "2025-11-22 10:22:19 AM"
    if (typeof dateString === 'string' && (dateString.includes(' AM') || dateString.includes(' PM'))) {
      // Parse format: "YYYY-MM-DD HH:MM:SS AM/PM"
      const parts = dateString.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0]; // "2025-11-22"
        const timePart = parts[1]; // "10:22:19"
        const ampm = parts[2]; // "AM" or "PM"

        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');

        let hour24 = parseInt(hours, 10);
        if (ampm === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (ampm === 'AM' && hour24 === 12) {
          hour24 = 0;
        }

        date = new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          hour24,
          parseInt(minutes, 10),
          parseInt(seconds, 10)
        );
      } else {
        date = new Date(dateString);
      }
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

export const CampaignCard = ({ campaign, onViewDetail }) => {
  const thumbnail = campaign.introImageUrl || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop';
  const creatorName = campaign.owner ? `${campaign.owner.firstName} ${campaign.owner.lastName}` : 'N/A';
console.log("campaign.campaignStatus", campaign.campaignStatus);
  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <img
        src={thumbnail}
        alt={campaign.title}
        className='w-full h-48 object-cover'
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop';
        }}
      />
      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between'>
          <h3 className='font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 flex-1'>
            {campaign.title}
          </h3>
          {getStatusBadge(campaign.campaignStatus)}
        </div>

        <div className='space-y-2 text-sm text-gray-600 dark:text-text-white'>
          <div className='flex items-center'>
            <Users className='w-4 h-4 mr-2' />
            <span>{creatorName}</span>
          </div>
          <div className='flex items-center'>
            <Target className='w-4 h-4 mr-2' />
            <span>{formatCurrency(campaign.goalAmount || 0)}</span>
          </div>
          <div className='flex items-center'>
            <Calendar className='w-4 h-4 mr-2' />
            <span>Nộp: {formatDate(campaign.createdAt)}</span>
          </div>
        </div>

        {(campaign.campaignStatus === 'APPROVED' || campaign.campaignStatus === 'ACTIVE' || campaign.campaignStatus === 'SUCCESSFUL') && (
          <div className='pt-2 border-t dark:border-gray-700'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600 dark:text-text-white'>Đã đạt:</span>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                {formatCurrency(campaign.pledgedAmount || 0)}
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-blue-600 dark:bg-blue-500 h-2 rounded-full'
                style={{
                  width: `${Math.min(
                    ((campaign.pledgedAmount || 0) / (campaign.goalAmount || 1)) * 100,
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
