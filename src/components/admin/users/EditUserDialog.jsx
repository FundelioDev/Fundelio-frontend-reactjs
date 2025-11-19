import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export const EditUserDialog = ({ open, onOpenChange, user, onSave }) => {
  const [form, setForm] = useState({ email: '', roleIds: [], isVerified: false });

  useEffect(() => {
    if (user) setForm({ email: user.email, roleIds: user.roleIds, isVerified: user.isVerified });
  }, [user]);

  const handleSave = () => onSave(form) || onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input name="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
          <Select value={form.roleIds[0] || ''} onValueChange={(v) => setForm((p) => ({ ...p, roleIds: [v] }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MODERATOR">Moderator</SelectItem>
              <SelectItem value="CREATOR">Creator</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.isVerified ? 'true' : 'false'} onValueChange={(v) => setForm((p) => ({ ...p, isVerified: v === 'true' }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Xác thực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Đã xác thực</SelectItem>
              <SelectItem value="false">Chưa xác thực</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
