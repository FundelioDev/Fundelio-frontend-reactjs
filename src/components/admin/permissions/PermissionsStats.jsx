import { Card } from '@/components/ui/card';
import { Key } from 'lucide-react';

export const PermissionsStats = ({ permissions, categories }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='p-4 bg-white dark:bg-darker-2 border-border transition-colors duration-300'>
        <div className='flex items-center space-x-3'>
          <div className='p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg transition-colors duration-300'>
            <Key className='w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300' />
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-text-white transition-colors duration-300'>
              Tổng quyền
            </p>
            <p className='text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300'>
              {permissions.length}
            </p>
          </div>
        </div>
      </Card>
      {categories.slice(1).map((category) => {
        const count = permissions.filter((p) => p.category === category).length;
        return (
          <Card key={category} className='p-4 bg-white dark:bg-darker-2 border-border transition-colors duration-300'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 bg-gray-50 dark:bg-darker-2/50 rounded-lg transition-colors duration-300'>
                <Key className='w-5 h-5 text-gray-600 dark:text-text-white transition-colors duration-300' />
              </div>
              <div>
                <p className='text-sm text-gray-600 dark:text-text-white transition-colors duration-300'>
                  {category}
                </p>
                <p className='text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300'>
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
