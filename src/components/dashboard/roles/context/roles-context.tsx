'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Role } from '../data/schema';
import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { rolesApi } from '@/api-client';

type RolesDialogType = 'add' | 'edit' | 'delete';
type SetOpenType = (type: RolesDialogType | null) => void;

interface RolesContextType {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  meta: {
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };
  fetchRoles: (page?: number) => Promise<void>;
  createRole: (data: {
    name: string;
    description: string;
    active: boolean;
    permissionIds: string[];
  }) => Promise<void>;
  updateRole: (
    roleId: string,
    data: {
      name?: string;
      description?: string;
      active?: boolean;
      permissionIds?: string[];
    }
  ) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  updateRolePermissions: (
    roleId: string,
    permissions: string[]
  ) => Promise<void>;
  open: RolesDialogType | null;
  setOpen: SetOpenType;
  currentRow: Role | null;
  setCurrentRow: (role: Role | null) => void;
  handleCloseDialog: () => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function RolesProvider({ children }: Props) {
  const [open, setOpenState] = useState<RolesDialogType | null>(null);
  const setOpen: SetOpenType = useCallback(
    (type) => {
      console.log('RolesContext - Dialog state changed:', {
        from: open,
        to: type,
      });
      setOpenState(type);
    },
    [open]
  );
  const [currentRow, setCurrentRow] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    totalPages: 1,
    currentPage: 1,
    totalElements: 0,
  });

  // Fetch roles
  const fetchRoles = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesApi.getRoles({ page });

      if (response.data.success) {
        setRoles(response.data.data.content);
        setMeta(response.data.data.meta);
      } else {
        setError(response.data.message || 'Không thể tải danh sách vai trò');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Refetch data
  const refetch = useCallback(() => {
    fetchRoles(meta.currentPage);
  }, [fetchRoles, meta.currentPage]);

  // Create role
  const createRole = useCallback(
    async (data: {
      name: string;
      description: string;
      active: boolean;
      permissionIds: string[];
    }) => {
      try {
        setIsLoading(true);
        const response = await rolesApi.createRole({
          name: data.name,
          description: data.description,
          active: data.active,
          permissionIds: data.permissionIds,
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Không thể tạo vai trò');
        }

        setOpen(null);
        fetchRoles(); // Tải lại dữ liệu sau khi tạo
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo vai trò'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRoles, setOpen]
  );

  // Update role
  const updateRole = useCallback(
    async (
      roleId: string,
      data: {
        name?: string;
        description?: string;
        active?: boolean;
        permissionIds?: string[];
      }
    ) => {
      try {
        setIsLoading(true);
        const response = await rolesApi.updateRole(roleId, data);

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Không thể cập nhật vai trò'
          );
        }

        setOpen(null);
        setCurrentRow(null);
        fetchRoles(); // Tải lại dữ liệu sau khi cập nhật
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi khi cập nhật vai trò'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRoles, setOpen, setCurrentRow]
  );

  // Delete role
  const deleteRole = useCallback(
    async (roleId: string) => {
      try {
        setIsLoading(true);
        const response = await rolesApi.deleteRole(roleId);

        if (!response.data.success) {
          throw new Error(response.data.message || 'Không thể xóa vai trò');
        }

        setOpen(null);
        setCurrentRow(null);
        fetchRoles(); // Tải lại dữ liệu sau khi xóa
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa vai trò'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRoles, setOpen, setCurrentRow]
  );

  // Update role permissions
  const updateRolePermissions = useCallback(
    async (roleId: string, permissions: string[]) => {
      try {
        setIsLoading(true);
        const response = await rolesApi.updateRolePermissions(
          roleId,
          permissions
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Không thể cập nhật quyền');
        }

        fetchRoles(); // Tải lại dữ liệu sau khi cập nhật quyền
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi khi cập nhật quyền'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRoles]
  );

  const handleCloseDialog = useCallback(() => {
    console.log('RolesContext - handleCloseDialog called, closing dialog');
    setOpen(null);
    setCurrentRow(null);
  }, [setOpen]);

  return (
    <RolesContext.Provider
      value={{
        roles,
        isLoading,
        error,
        refetch,
        meta,
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
        updateRolePermissions,
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        handleCloseDialog,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}
