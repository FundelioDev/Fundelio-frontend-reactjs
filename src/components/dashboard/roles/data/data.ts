import {
  IconShield,
  IconUserShield,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ComponentType } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface Option {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export const useRoleStatuses = () => {
  const { t } = useLanguage();
  return [
    { label: t('roleStatus.active'), value: 'active' },
    { label: t('roleStatus.inactive'), value: 'inactive' },
  ];
};

export const useRoleLevels = () => {
  const { t } = useLanguage();
  return [
    {
      value: 'high',
      label: t('roleLevel.high'),
    },
    {
      value: 'medium',
      label: t('roleLevel.medium'),
    },
    {
      value: 'low',
      label: t('roleLevel.low'),
    },
  ] as const;
};

export const useRoleTypes = () => {
  const { t } = useLanguage();
  return [
    {
      label: t('roleType.superadmin'),
      value: 'superadmin',
      icon: IconShield,
    },
    {
      label: t('roleType.admin'),
      value: 'admin',
      icon: IconUserShield,
    },
    {
      label: t('roleType.manager'),
      value: 'manager',
      icon: IconUsersGroup,
    },
  ];
};

export const modulePermissions: Record<
  string,
  {
    label: string;
    permissions: readonly ('create' | 'read' | 'update' | 'delete')[];
  }
> = {
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
} as const;

export type ModuleType = keyof typeof modulePermissions; 