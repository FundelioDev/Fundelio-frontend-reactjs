import React, { useState, useCallback, useEffect } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';
import { usersApi } from '@/api/api-client';

const UsersContext = createContext(undefined);

// Hàm sắp xếp users theo role priority
const sortUsersByRole = (users) => {
  const rolePriority = {
    'ADMIN': 1,
    'FOUNDER': 2,
    'BACKER': 3,
  };

  return [...users].sort((a, b) => {
    // Lấy role cao nhất của mỗi user
    const getRolePriority = (user) => {
      if (!user.roles || user.roles.length === 0) return 999;
      
      const priorities = user.roles.map(role => {
        const roleName = role.name?.toUpperCase();
        return rolePriority[roleName] || 100; // Role khác có priority 100
      });
      
      return Math.min(...priorities); // Lấy priority thấp nhất (cao nhất về thứ tự)
    };

    const priorityA = getRolePriority(a);
    const priorityB = getRolePriority(b);

    // Nếu priority khác nhau, sort theo priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Nếu priority giống nhau, sort theo tên role
    const roleNameA = a.roles?.[0]?.name || '';
    const roleNameB = b.roles?.[0]?.name || '';
    return roleNameA.localeCompare(roleNameB);
  });
};

const UsersProvider = ({ children }) => {
  const [open, setOpen] = useDialogState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersApi.getUsers();
      console.log('API Response:', response);
      console.log('API Response structure:', {
        data: response.data,
        success: response.data?.success,
        dataKey: response.data?.data,
        content: response.data?.data?.content,
        isArray: Array.isArray(response.data?.data?.content),
      });

      let usersData = [];

      if (!response.data?.data?.content) {
        console.error('Cấu trúc dữ liệu không đúng:', response.data);

        if (Array.isArray(response.data?.data)) {
          console.log('Tìm thấy mảng dữ liệu trong response.data.data');
          usersData = response.data.data;
        } else if (Array.isArray(response.data?.content)) {
          console.log('Tìm thấy mảng dữ liệu trong response.data.content');
          usersData = response.data.content;
        } else if (Array.isArray(response.data)) {
          console.log('Tìm thấy mảng dữ liệu trong response.data');
          usersData = response.data;
        } else {
          usersData = [];
        }
      } else {
        usersData = response.data.data.content;
      }

      // Sắp xếp users theo role priority
      const sortedUsers = sortUsersByRole(usersData);
      setUsers(sortedUsers);
    } catch (error) {
      console.error('API Error:', error);
      setError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await usersApi.createUser(data);
        toast({
          title: 'Thành công',
          description: 'Tạo người dùng thành công',
        });
        setOpen(null);
        await fetchUsers();
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể tạo người dùng',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers, setOpen]
  );

  const updateUser = useCallback(
    async (id, data) => {
      try {
        setIsLoading(true);
        await usersApi.updateUser(id, data);
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin người dùng thành công',
        });
        setOpen(null);
        setCurrentRow(null);
        await fetchUsers();
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể cập nhật người dùng',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers, setOpen]
  );

  const deleteUser = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        await usersApi.deleteUser(id);
        toast({
          title: 'Thành công',
          description: 'Xóa người dùng thành công',
        });
        setOpen(null);
        setCurrentRow(null);
        await fetchUsers();
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể xóa người dùng',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers, setOpen]
  );

  return (
    <UsersContext.Provider
      value={{
        users,
        isLoading,
        error,
        refetch: fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { UsersProvider };

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}

