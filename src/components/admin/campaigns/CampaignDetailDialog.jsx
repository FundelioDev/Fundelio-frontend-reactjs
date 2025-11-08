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
import { Check, X, Clock } from 'lucide-react';
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

export const CampaignDetailDialog = ({
  campaign,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  if (!campaign) return null;

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
              src={campaign.thumbnail}
              alt={campaign.title}
              className='w-32 h-32 rounded-lg object-cover'
            />
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {campaign.title}
              </h3>
              <p className='text-gray-600 dark:text-text-white mt-1'>
                {campaign.category}
              </p>
              <div className='flex items-center space-x-2 mt-2'>
                {getStatusBadge(campaign.status)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
              <TabsTrigger value='creator'>Người tạo</TabsTrigger>
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
                    {formatCurrency(campaign.targetAmount)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Đã đạt
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(campaign.currentAmount)}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Người ủng hộ
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {campaign.backers}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Thời gian còn lại
                  </p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {campaign.daysLeft} ngày
                  </p>
                </Card>
              </div>

              {campaign.status === 'rejected' && (
                <Card className='p-4 bg-red-50 border-red-200'>
                  <h4 className='font-semibold text-red-900 mb-2'>
                    Lý do từ chối
                  </h4>
                  <p className='text-red-800'>{campaign.rejectionReason}</p>
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
                    {campaign.creator}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 dark:text-text-white'>
                    Email
                  </p>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {campaign.creatorEmail}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='timeline' className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2' />
                  <div>
                    <p className='font-medium text-gray-900 dark:text-gray-100'>
                      Nộp chiến dịch
                    </p>
                    <p className='text-sm text-gray-600 dark:text-text-white'>
                      {campaign.submittedAt}
                    </p>
                  </div>
                </div>
                {campaign.approvedAt && (
                  <div className='flex items-start space-x-3'>
                    <div className='w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2' />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-gray-100'>
                        Được phê duyệt
                      </p>
                      <p className='text-sm text-gray-600 dark:text-text-white'>
                        {campaign.approvedAt}
                      </p>
                    </div>
                  </div>
                )}
                {campaign.rejectedAt && (
                  <div className='flex items-start space-x-3'>
                    <div className='w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2' />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-gray-100'>
                        Bị từ chối
                      </p>
                      <p className='text-sm text-gray-600 dark:text-text-white'>
                        {campaign.rejectedAt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {campaign.status === 'pending' && (
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
