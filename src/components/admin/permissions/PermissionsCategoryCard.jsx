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
    <Card>
      <div className='p-4 bg-gray-50 dark:bg-darker-2/10 border-b border-border'>
        <div className='flex items-center space-x-2'>
          <Key className='w-5 h-5 text-gray-600 dark:text-text-white' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            {category}
          </h3>
          <Badge variant='secondary'>{permissions.length}</Badge>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên quyền</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className='text-right'>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <Key className='w-4 h-4 text-gray-400 dark:text-text-white' />
                  <code className='text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded'>
                    {permission.name}
                  </code>
                </div>
              </TableCell>
              <TableCell className='text-gray-600 dark:text-text-white'>
                {permission.description}
              </TableCell>
              <TableCell>{getCategoryBadge(permission.category)}</TableCell>
              <TableCell>
                <div className='flex items-center justify-end space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(permission)}
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(permission)}
                  >
                    <Trash2 className='w-4 h-4 text-red-600' />
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
