import { Card } from '@/components/ui/card';
import { Key } from 'lucide-react';

export const PermissionsStats = ({ permissions, categories }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='p-4'>
        <div className='flex items-center space-x-3'>
          <div className='p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
            <Key className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-text-white'>
              Tổng quyền
            </p>
            <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              {permissions.length}
            </p>
          </div>
        </div>
      </Card>
      {categories.slice(1).map((category) => {
        const count = permissions.filter((p) => p.category === category).length;
        return (
          <Card key={category} className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <Key className='w-5 h-5 text-gray-600 dark:text-text-white' />
              </div>
              <div>
                <p className='text-sm text-gray-600 dark:text-text-white'>
                  {category}
                </p>
                <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                  {count}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
