'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { rolesApi } from '@/api/rolesApi';

const RolesContext = createContext(undefined);

export default function RolesProvider({ children }) {
  const [open, setOpenState] = useState(null);
  const setOpen = useCallback(
    (type) => {
      console.log('RolesContext - Dialog state changed:', {
        from: open,
        to: type,
      });
      setOpenState(type);
    },
    [open]
  );
  const [currentRow, setCurrentRow] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    totalPages: 1,
    currentPage: 1,
    totalElements: 0,
  });

  // Fetch roles
  const fetchRoles = useCallback(async (page = 1) => {
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
    async (data) => {
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
    async (roleId, data) => {
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
    async (roleId) => {
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
    async (roleId, permissions) => {
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

