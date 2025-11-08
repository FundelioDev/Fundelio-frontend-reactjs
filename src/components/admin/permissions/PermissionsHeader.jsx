import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const PermissionsHeader = ({ totalPermissions, onAdd }) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h2 className='text-2xl font-bold text-text-primary dark:text-white transition-colors duration-300'>
          Quản lý quyền hạn
        </h2>
        <p className='text-sm text-gray-600 dark:text-text-white mt-1 transition-colors duration-300'>
          Tổng {totalPermissions} quyền hạn
        </p>
      </div>
      <Button onClick={onAdd}>
        <Plus className='w-4 h-4 mr-2' />
        Thêm quyền hạn
      </Button>
    </div>
  );
};
