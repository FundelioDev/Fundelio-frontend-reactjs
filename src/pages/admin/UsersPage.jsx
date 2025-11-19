// src/pages/admin/UsersPage.jsx
import { useState, useEffect } from 'react';
import { userApi } from '@/api/userApi';
import {
  UsersTableHeader,
  UsersTable,
  UserDetailDialog,
  AddUserDialog,
  EditUserDialog,
  UserDeleteDialog,
} from '@/components/admin/users';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [filterRole, setFilterRole] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // --------------------------
  // Map backend user -> FE user shape
  // --------------------------
  const mapUser = (u) => ({
    id: u.userId,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    name: `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim(),
    email: u.email,
    roles: u.roles || [],
    roleIds: (u.roles || []).map((r) => r.roleId),
    role: u.roles && u.roles[0] ? u.roles[0].name : 'USER',
    status: u.status || 'active',
    isVerified: u.isVerified || false,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin || '-',
    avatar: u.avatarUrl || null,
    raw: u,
  });

  // --------------------------
  // Fetch users từ API với search + filter + pagination
  // --------------------------
  const fetchUsers = async () => {
  try {
    const params = { page, size: pageSize };

    if (debouncedSearch) {
      // Thay đổi từ search → filter backend yêu cầu
      params.filter = `email:'${debouncedSearch}'`;
    }

    if (filterRole !== 'all') {
      params.role = filterRole;
    }

    console.log('[DEBUG] Fetching users with params:', params);
    const res = await userApi.getUsers(params);

    const content = res?.data?.data?.content || [];
    const meta = res?.data?.data?.meta || {};

    setUsers(content.map(mapUser));
    setTotalUsers(meta.totalElements || content.length);
  } catch (err) {
    console.error('[ERROR] Fetch users failed:', err);
    setUsers([]);
    setTotalUsers(0);
  }
};

  // --------------------------
  // Debounce search input
  // --------------------------
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --------------------------
  // Trigger fetch khi page / debouncedSearch / filterRole thay đổi
  // --------------------------
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, filterRole]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  // --------------------------
  // Actions
  // --------------------------
  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleAddUserOpen = () => setShowAddUserDialog(true);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1); // reset page khi search
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
    setPage(1); // reset page khi filter
  };

  // --------------------------
  // Add / Update / Delete
  // --------------------------
  const addUser = async (formData) => {
    try {
      const res = await userApi.createUser(formData);
      const created = res?.data?.data;
      if (created) {
        setUsers((prev) => [mapUser(created), ...prev]);
        setTotalUsers((t) => t + 1);
      } else alert('User created but server response unexpected.');
    } catch (err) {
      console.error('Add user failed:', err);
      alert('Tạo người dùng thất bại');
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const payload = {
        email: updatedData.email,
        isVerified: updatedData.isVerified,
        roleIds: updatedData.roleIds,
      };
      const res = await userApi.updateUser(selectedUser.id, payload);
      const updated = res?.data?.data;
      if (updated) {
        const mapped = mapUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === mapped.id ? mapped : u)));
      }
    } catch (err) {
      console.error('Update user failed:', err);
      alert('Cập nhật thất bại');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalUsers((t) => Math.max(0, t - 1));
    } catch (err) {
      console.error('Delete user failed:', err);
      alert('Xóa người dùng thất bại');
    }
  };

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="space-y-6">
      <UsersTableHeader
        totalUsers={totalUsers}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterRole={filterRole}
        onFilterChange={handleFilterChange}
        onAddUser={handleAddUserOpen}
      />

      <UsersTable
        users={users}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

      {/* Dialogs */}
      <UserDetailDialog
        user={selectedUser}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onEdit={handleEdit}
      />
      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onAdd={addUser}
      />
      <EditUserDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={selectedUser}
        onSave={updateUser}
      />
      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        user={selectedUser}
        onConfirm={deleteUser}
      />
    </div>
  );
}
