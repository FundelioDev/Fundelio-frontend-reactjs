import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Eye, Loader, TrendingUp, TrendingDown, Ban, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

const getStatusBadge = (status) => {
  const statusConfig = {
    DRAFT: { variant: 'secondary', label: 'Bản nháp', icon: FileText },
    PENDING: { variant: 'warning', label: 'Chờ duyệt', icon: Clock },
    APPROVED: { variant: 'success', label: 'Đã duyệt', icon: Check },
    REJECTED: { variant: 'destructive', label: 'Từ chối', icon: X },
    ACTIVE: { variant: 'default', label: 'Đang gây quỹ', icon: Loader },
    SUCCESSFUL: { variant: 'success', label: 'Thành công', icon: TrendingUp },
    FAILED: { variant: 'destructive', label: 'Thất bại', icon: TrendingDown },
    ENDED: { variant: 'secondary', label: 'Kết thúc', icon: Ban },
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
    if (typeof dateString === 'string' && dateString.includes(' AM') || dateString.includes(' PM')) {
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
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

const getCategoryLabel = (category) => {
  const labels = {
    ART: 'Nghệ thuật',
    MUSIC: 'Âm nhạc',
    FILM: 'Phim ảnh',
    GAMES: 'Trò chơi',
    TECHNOLOGY: 'Công nghệ',
    PUBLISHING: 'Xuất bản',
    FOOD: 'Ẩm thực',
    FASHION: 'Thời trang',
  };
  return labels[category] || category;
};

export const CampaignDetailDialog = ({
  campaign,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();

  if (!campaign) return null;

  const thumbnail = campaign.introImageUrl || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop';
  const creatorName = campaign.owner ? `${campaign.owner.firstName} ${campaign.owner.lastName}` : 'N/A';
  const creatorEmail = campaign.owner?.email || 'N/A';

  const handlePreview = () => {
    // Navigate to preview page with campaign ID and fromAdmin flag
    navigate(`/campaigns/preview/${campaign.campaignId}`, {
      state: { fromAdmin: true }
    });
    onOpenChange(false);
  };

  console.log('Campaign Status: DB', campaign);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Chi tiết chiến dịch</DialogTitle>
          <DialogDescription>Xem xét và phê duyệt chiến dịch</DialogDescription>
        </DialogHeader>
        <div className='space-y-6'>
          {/* Campaign Header */}
          <div className='flex items-start space-x-4'>
            <img
              src={thumbnail}
              alt={campaign.title}
              className='w-32 h-32 rounded-lg object-cover'
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop';
              }}
            />
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {campaign.title}
              </h3>
              <p className='text-gray-600 dark:text-text-white mt-1'>
                {getCategoryLabel(campaign.campaignCategory)}
              </p>
              <div className='flex items-center space-x-2 mt-2'>
                {getStatusBadge(campaign.campaignStatus)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
              <TabsTrigger value='creator'>Người tạo</TabsTrigger>
              <TabsTrigger value='statistics'>Thống kê</TabsTrigger>
              <TabsTrigger value='timeline'>Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <div>
                <h4 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>
                  Mô tả
                </h4>
                <p className='text-gray-600 dark:text-text-white'>
                  {campaign.description}
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Mục tiêu
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(campaign.goalAmount || 0)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Đã đạt
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(campaign.pledgedAmount || 0)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Người ủng hộ
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {campaign.backersCount || 0}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Thời gian
                  </p>
                  <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </p>
                </Card>
              </div>

              {campaign.campaignStatus === 'REJECTED' && campaign.rejectionReason && (
                <Card className='p-4 bg-red-50 border-red-200 dark:bg-red-900/20'>
                  <h4 className='font-semibold text-red-900 dark:text-red-400 mb-2'>
                    Lý do từ chối
                  </h4>
                  <p className='text-red-800 dark:text-red-300'>{campaign.rejectionReason}</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='creator' className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Tên người tạo
                  </p>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {creatorName}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Email
                  </p>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {creatorEmail}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    User ID
                  </p>
                  <p className='font-medium text-gray-900 dark:text-gray-100 text-xs'>
                    {campaign.owner?.userId || 'N/A'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='statistics' className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white mb-1'>
                    Mục tiêu
                  </p>
                  <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(campaign.goalAmount || 0)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white mb-1'>
                    Đã đạt
                  </p>
                  <p className='text-xl font-bold text-primary'>
                    {formatCurrency(campaign.pledgedAmount || campaign.currentAmount || 0)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white mb-1'>
                    Tiến độ
                  </p>
                  <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                    {Math.min(100, Math.round(((campaign.pledgedAmount || campaign.currentAmount || 0) / (campaign.goalAmount || 1)) * 100))}%
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white mb-1'>
                    Người ủng hộ
                  </p>
                  <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                    {campaign.backersCount || campaign.backerCount || 0}
                  </p>
                </Card>
              </div>

              {/* View Full Statistics Button */}
              <div className='pt-4'>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => {
                    navigate(`/campaigns/${campaign.campaignId}/statistics?fromAdmin=true`);
                    onOpenChange(false);
                  }}
                >
                  <TrendingUp className='w-4 h-4 mr-2' />
                  Xem thống kê chi tiết
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='timeline' className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2' />
                  <div>
                    <p className='font-medium text-gray-900 dark:text-gray-100'>
                      Tạo chiến dịch
                    </p>
                    <p className='text-sm text-gray-600 dark:text-text-white'>
                      {formatDate(campaign.createdAt)}
                    </p>
                  </div>
                </div>
                {campaign.updatedAt && campaign.updatedAt !== campaign.createdAt && (
                  <div className='flex items-start space-x-3'>
                    <div className='w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full mt-2' />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-gray-100'>
                        Cập nhật gần nhất
                      </p>
                      <p className='text-sm text-gray-600 dark:text-text-white'>
                        {formatDate(campaign.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button variant='secondary' onClick={handlePreview}>
            <Eye className='w-4 h-4 mr-2' />
            Xem Preview
          </Button>
          {campaign.campaignStatus === 'PENDING' && (
            <>
              <Button
                variant='destructive'
                onClick={() => {
                  onOpenChange(false);
                  onReject(campaign);
                }}
              >
                <X className='w-4 h-4 mr-2' />
                Từ chối
              </Button>
              <Button onClick={() => onApprove(campaign)}>
                <Check className='w-4 h-4 mr-2' />
                Phê duyệt
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
