import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Key, Edit, Trash2 } from 'lucide-react';
import { getCategoryBadge } from '@/utils/statusHelpers';

export const PermissionsCategoryCard = ({
  category,
  permissions,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className='bg-white dark:bg-darker-2 border-border transition-colors duration-300'>
      <div className='p-4 bg-gray-50 dark:bg-darker-2/50 border-b border-border transition-colors duration-300'>
        <div className='flex items-center space-x-2'>
          <Key className='w-5 h-5 text-gray-600 dark:text-text-white transition-colors duration-300' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300'>
            {category}
          </h3>
          <Badge variant='secondary'>{permissions.length}</Badge>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50/50 dark:bg-darker-2/30 transition-colors duration-300'>
            <TableHead className='text-text-primary dark:text-white transition-colors duration-300'>Tên quyền</TableHead>
            <TableHead className='text-text-primary dark:text-white transition-colors duration-300'>Mô tả</TableHead>
            <TableHead className='text-text-primary dark:text-white transition-colors duration-300'>Danh mục</TableHead>
            <TableHead className='text-right text-text-primary dark:text-white transition-colors duration-300'>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id} className='hover:bg-gray-50 dark:hover:bg-darker-2/50 transition-colors duration-300'>
              <TableCell className='text-text-primary dark:text-white transition-colors duration-300'>
                <div className='flex items-center space-x-2'>
                  <Key className='w-4 h-4 text-gray-400 dark:text-text-white transition-colors duration-300' />
                  <code className='text-sm font-mono bg-gray-100 dark:bg-darker-2 text-gray-900 dark:text-white px-2 py-1 rounded transition-colors duration-300'>
                    {permission.name}
                  </code>
                </div>
              </TableCell>
              <TableCell className='text-gray-600 dark:text-text-white transition-colors duration-300'>
                {permission.description}
              </TableCell>
              <TableCell className='text-text-primary dark:text-white transition-colors duration-300'>{getCategoryBadge(permission.category)}</TableCell>
              <TableCell>
                <div className='flex items-center justify-end space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(permission)}
                    className='hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
                  >
                    <Edit className='w-4 h-4 text-gray-600 dark:text-text-white transition-colors duration-300' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(permission)}
                    className='hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
                  >
                    <Trash2 className='w-4 h-4 text-red-600 dark:text-red-400 transition-colors duration-300' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
