import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card className='p-6'>
    <div className='flex items-start justify-between'>
      <div>
        <p className='text-sm font-medium text-gray-600 dark:text-text-white'>
          {title}
        </p>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2'>
          {value}
        </h3>
        {trend && (
          <div className='flex items-center mt-2'>
            {trend === 'up' ? (
              <ArrowUpRight className='w-4 h-4 text-green-500' />
            ) : (
              <ArrowDownRight className='w-4 h-4 text-red-500' />
            )}
            <span
              className={`text-sm ml-1 ${
                trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trendValue}%
            </span>
            <span className='text-xs text-gray-500 dark:text-text-white ml-1'>
              so với tháng trước
            </span>
          </div>
        )}
      </div>
      <div className='p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
        <Icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
      </div>
    </div>
  </Card>
);
