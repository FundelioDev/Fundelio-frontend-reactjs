import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const getStatusBadge = (status) => status === 'active' ? <Badge variant="success">Hoạt động</Badge> : <Badge variant="destructive">Không hoạt động</Badge>;

export const UserDetailDialog = ({ user, open, onOpenChange, onEdit }) => {
  if (!user) return null;
  const role = user.roles?.[0]?.name || 'USER';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>Thông tin chi tiết về người dùng</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                {user.name ? user.name.slice(0, 2).toUpperCase() : '?'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p>{user.email}</p>
              <div className="flex space-x-2 mt-2">
                <Badge>{role}</Badge>
                {getStatusBadge(user.status)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p>Ngày tạo</p>
              <p>{user.createdAt}</p>
            </div>
            <div>
              <p>Đăng nhập cuối</p>
              <p>{user.lastLogin}</p>
            </div>
            <div>
              <p>ID người dùng</p>
              <p>#{user.id}</p>
            </div>
            <div>
              <p>Vai trò</p>
              <p>{role}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
          <Button onClick={() => { onOpenChange(false); onEdit(user); }}>Chỉnh sửa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
