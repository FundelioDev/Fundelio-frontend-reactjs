// src/components/admin/users/UserDeleteDialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const UserDeleteDialog = ({ open, onOpenChange, user, onConfirm }) => {
  if (!user) return null;

  const handleConfirm = () => {
    onConfirm(user.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa người dùng</DialogTitle>
        </DialogHeader>
        <p>Bạn có chắc muốn xóa người dùng <b>{user.name}</b> không?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button variant="destructive" onClick={handleConfirm}>Xóa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
