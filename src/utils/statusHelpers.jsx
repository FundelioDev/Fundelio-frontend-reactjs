import { Badge } from '@/components/ui/badge';

/**
 * Get badge component for status
 * @param {string} status - Status key
 * @returns {JSX.Element} Badge component
 */
export const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Chờ duyệt' },
    approved: { variant: 'success', label: 'Đã duyệt' },
    rejected: { variant: 'destructive', label: 'Từ chối' },
    active: { variant: 'success', label: 'Đang chạy' },
    inactive: { variant: 'secondary', label: 'Không hoạt động' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

/**
 * Get role badge component
 * @param {string} role - Role name
 * @returns {JSX.Element} Badge component
 */
export const getRoleBadge = (role) => {
  const roleColors = {
    Admin: 'default',
    Moderator: 'secondary',
    Creator: 'outline',
    User: 'outline',
  };
  return <Badge variant={roleColors[role] || 'outline'}>{role}</Badge>;
};

/**
 * Get category badge component
 * @param {string} category - Category name
 * @returns {JSX.Element} Badge component
 */
export const getCategoryBadge = (category) => {
  const categoryColors = {
    General: 'default',
    Users: 'secondary',
    Campaigns: 'outline',
    Roles: 'outline',
  };
  return (
    <Badge variant={categoryColors[category] || 'outline'}>{category}</Badge>
  );
};
