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

export const UserDetailDialog = ({ user, open, onOpenChange, onEdit }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về người dùng
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <img
              src={user.avatar}
              alt={user.name}
              className='w-20 h-20 rounded-full'
            />
            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {user.name}
              </h3>
              <p className='text-gray-600 dark:text-text-white'>{user.email}</p>
              <div className='flex items-center space-x-2 mt-2'>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700'>
            <div>
              <p className='text-sm text-gray-600 dark:text-text-white'>
                Ngày tạo
              </p>
              <p className='font-medium text-gray-900 dark:text-gray-100'>
                {user.createdAt}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600 dark:text-text-white'>
                Đăng nhập cuối
              </p>
              <p className='font-medium text-gray-900 dark:text-gray-100'>
                {user.lastLogin}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600 dark:text-text-white'>
                ID người dùng
              </p>
              <p className='font-medium text-gray-900 dark:text-gray-100'>
                #{user.id}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600 dark:text-text-white'>
                Vai trò
              </p>
              <p className='font-medium text-gray-900 dark:text-gray-100'>
                {user.role}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={() => onEdit(user)}>Chỉnh sửa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
