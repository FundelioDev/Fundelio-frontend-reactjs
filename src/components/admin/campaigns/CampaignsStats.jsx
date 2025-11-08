import { Card } from '@/components/ui/card';

export const CampaignsStats = ({ statusCounts }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='p-4'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-text-white'>
            Tổng chiến dịch
          </p>
          <p className='text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1'>
            {statusCounts.all}
          </p>
        </div>
      </Card>
      <Card className='p-4 border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-text-white'>Chờ duyệt</p>
          <p className='text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1'>
            {statusCounts.pending}
          </p>
        </div>
      </Card>
      <Card className='p-4 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-text-white'>Đã duyệt</p>
          <p className='text-3xl font-bold text-green-600 dark:text-green-400 mt-1'>
            {statusCounts.approved}
          </p>
        </div>
      </Card>
      <Card className='p-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-text-white'>Từ chối</p>
          <p className='text-3xl font-bold text-red-600 dark:text-red-400 mt-1'>
            {statusCounts.rejected}
          </p>
        </div>
      </Card>
    </div>
  );
};
