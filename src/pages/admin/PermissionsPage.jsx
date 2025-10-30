import { useState } from 'react';
import { mockPermissions } from '@/data/mockAdminData';
import {
  PermissionsHeader,
  PermissionsFilters,
  PermissionsCategoryCard,
  PermissionsStats,
} from '@/components/admin/permissions';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(permissions.map((p) => p.category))];

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || permission.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group permissions by category
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  const handleAdd = () => {
    console.log('Add permission');
  };

  const handleEdit = (permission) => {
    console.log('Edit permission:', permission);
  };

  const handleDelete = (permission) => {
    console.log('Delete permission:', permission);
  };

  return (
    <div className='space-y-6'>
      <PermissionsHeader
        totalPermissions={permissions.length}
        onAdd={handleAdd}
      />

      <PermissionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />

      {/* Permissions by Category */}
      <div className='space-y-6'>
        {Object.entries(groupedPermissions).map(([category, perms]) => (
          <PermissionsCategoryCard
            key={category}
            category={category}
            permissions={perms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <PermissionsStats permissions={permissions} categories={categories} />
    </div>
  );
}
