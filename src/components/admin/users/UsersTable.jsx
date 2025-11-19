import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2 } from 'lucide-react';

const getInitials = (name = '') => {
  const words = name.trim().split(' ');
  return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : words[0].slice(0, 2).toUpperCase();
};

const getStatusBadge = (status) =>
  status === 'active' ? <Badge variant="success">Hoạt động</Badge> : <Badge variant="destructive">Không hoạt động</Badge>;

const getRoleBadge = (user) => {
  const role = user.roles?.[0]?.name || 'USER';
  const roleColors = { ADMIN: 'default', MODERATOR: 'secondary', CREATOR: 'outline', USER: 'outline' };
  return <Badge variant={roleColors[role] || 'outline'}>{role}</Badge>;
};

export const UsersTable = ({ users = [], onViewDetail, onEdit, onDelete }) => (
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
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getRoleBadge(user)}</TableCell>
            <TableCell>{getStatusBadge(user.status)}</TableCell>
            <TableCell>{user.createdAt}</TableCell>
            <TableCell>{user.lastLogin}</TableCell>
            <TableCell className="flex justify-end space-x-2">
              <Button variant="ghost" size="icon" onClick={() => onViewDetail(user)}><Eye className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(user)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(user)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-gray-500">Không có người dùng nào</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Card>
);
