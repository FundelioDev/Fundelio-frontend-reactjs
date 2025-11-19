'use client';

import { Main } from '@/components/dashboard/layout/MainDB';
import { useColumns } from '@/components/dashboard/roles/components/roles-columns';
import { RolesDialogs } from '@/components/dashboard/roles/components/roles-dialogs';
import { RolesPrimaryButtons } from '@/components/dashboard/roles/components/roles-primary-buttons';
import { RolesTable } from '@/components/dashboard/roles/components/roles-table';
import RolesProvider from '@/components/dashboard/roles/context/roles-context';
import { useRoles } from '@/components/dashboard/roles/context/roles-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PermissionsProvider } from '@/components/dashboard/permissions/context/permissions-context';
import Loading from '@/components/common/Loading';

function RolesContent() {
  const { roles, isLoading, error } = useRoles();
  const columns = useColumns();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          {error?.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-text-primary dark:text-white transition-colors duration-300'>
            Quản lý vai trò
          </h2>
          <p className='text-muted-foreground dark:text-text-white transition-colors duration-300'>
            Quản lý và phân quyền cho các vai trò trong hệ thống
          </p>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <RolesTable data={roles} />
      </div>
    </>
  );
}

export default function RolesPage() {
  return (
    <PermissionsProvider>
      <RolesProvider>
        <Main>
          <RolesContent />
        </Main>
        <RolesDialogs />
      </RolesProvider>
    </PermissionsProvider>
  );
}
