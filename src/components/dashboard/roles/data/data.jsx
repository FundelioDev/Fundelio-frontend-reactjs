import { Shield, UserCog, Users } from 'lucide-react';

export const useRoleStatuses = () => {
  return [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
  ];
};

export const useRoleLevels = () => {
  return [
    {
      value: 'high',
      label: 'Cao',
    },
    {
      value: 'medium',
      label: 'Trung bình',
    },
    {
      value: 'low',
      label: 'Thấp',
    },
  ];
};

export const useRoleTypes = () => {
  return [
    {
      label: 'Super Admin',
      value: 'superadmin',
      icon: Shield,
    },
    {
      label: 'Admin',
      value: 'admin',
      icon: UserCog,
    },
    {
      label: 'Manager',
      value: 'manager',
      icon: Users,
    },
  ];
};

export const modulePermissions = {
  users: {
    label: 'Người dùng',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  roles: {
    label: 'Vai trò',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  products: {
    label: 'Sản phẩm',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  categories: {
    label: 'Danh mục',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  orders: {
    label: 'Đơn hàng',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  customers: {
    label: 'Khách hàng',
    permissions: ['create', 'read', 'update', 'delete'],
  },
};
