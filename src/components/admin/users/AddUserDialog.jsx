// src/components/admin/users/AddUserDialog.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export const AddUserDialog = ({ open, onOpenChange, onAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('active');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !email) {
      alert('Vui lòng điền ít nhất first name và email');
      return;
    }

    const form = new FormData();
    form.append('firstName', firstName);
    form.append('lastName', lastName);
    form.append('email', email);
    form.append('role', role);
    form.append('status', status);
    if (avatarFile) form.append('avatar', avatarFile);

    // onAdd nhận FormData để gửi lên API
    onAdd(form);

    // reset
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('USER');
    setStatus('active');
    setAvatarFile(null);
    setAvatarPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>Vui lòng nhập thông tin người dùng</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-text-white">Ảnh đại diện</p>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatarPreview && <img src={avatarPreview} alt="Preview" className="w-20 h-20 rounded-full mt-2 object-cover" />}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-text-white">Họ</p>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Họ" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-text-white">Tên</p>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tên" />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-text-white">Email</p>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-text-white">Vai trò</p>
            <Select value={role} onValueChange={setRole}>
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
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-text-white">Trạng thái</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSubmit}>Thêm người dùng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
