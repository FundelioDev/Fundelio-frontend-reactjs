import { useState } from 'react';
import { mockUsers } from '@/data/mockAdminData';
import {
  UsersTableHeader,
  UsersTable,
  UserDetailDialog,
} from '@/components/admin/users';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    // Implement edit logic
  };

  const handleDelete = (user) => {
    console.log('Delete user:', user);
    // Implement delete logic
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // Implement add user logic
  };

  return (
    <div className='space-y-6'>
      <UsersTableHeader
        totalUsers={users.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterChange={setFilterRole}
        onAddUser={handleAddUser}
      />

      <UsersTable
        users={filteredUsers}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserDetailDialog
        user={selectedUser}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onEdit={handleEdit}
      />
    </div>
  );
}
