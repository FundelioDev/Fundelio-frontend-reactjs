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
import { Eye, Edit, Trash2 } from 'lucide-react';

const getStatusBadge = (status) => {
  return status === 'active' ? (
    <Badge variant='success'>Hoạt động</Badge>
  ) : (
    <Badge variant='destructive'>Không hoạt động</Badge>
  );
};

const getRoleBadge = (role) => {
  const roleColors = {
    Admin: 'default',
    Moderator: 'secondary',
    Creator: 'outline',
    User: 'outline',
  };
  return <Badge variant={roleColors[role] || 'outline'}>{role}</Badge>;
};

export const UsersTable = ({ users, onViewDetail, onEdit, onDelete }) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Đăng nhập cuối</TableHead>
            <TableHead className='text-right'>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className='flex items-center space-x-3'>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className='w-10 h-10 rounded-full'
                  />
                  <span className='font-medium text-gray-900 dark:text-gray-100'>
                    {user.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className='text-gray-600 dark:text-text-white'>
                {user.email}
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className='text-gray-600 dark:text-text-white'>
                {user.createdAt}
              </TableCell>
              <TableCell className='text-gray-600 dark:text-text-white'>
                {user.lastLogin}
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-end space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onViewDetail(user)}
                  >
                    <Eye className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(user)}
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(user)}
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
