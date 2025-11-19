import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUsers } from '../context/users-context';

export function UsersDeleteDialog({ currentRow, open, onOpenChange }) {
  const [value, setValue] = useState('');
  const { deleteUser } = useUsers();

  const handleDelete = async () => {
    if (!currentRow || value.trim() !== currentRow.email) return;

    await deleteUser(currentRow.userId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng{' '}
            <span className="font-medium">{currentRow?.email}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Nhập email để xác nhận"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={value.trim() !== currentRow?.email}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

