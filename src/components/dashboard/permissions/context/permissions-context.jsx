import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { permissionsApi } from '@/api/permissionApi';

const PermissionsContext = createContext(undefined);

export function PermissionsProvider({ children }) {
  const [open, setOpen] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsedModules, setCollapsedModules] = useState({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch modules
      const modulesResponse = await permissionsApi.getModules();
      if (modulesResponse?.data?.success) {
        setModules(modulesResponse.data.data || []);
      }

      // Fetch permissions
      const permissionsResponse = await permissionsApi.getPermissions({
        page: 1,
        size: 100,
      });
      if (permissionsResponse?.data?.success) {
        const permissionsData = permissionsResponse.data.data?.content || [];
        const formattedPermissions = permissionsData.map((permission) => ({
          ...permission,
          module: permission.module || '',
          httpMethod: permission.httpMethod || 'GET',
        }));
        setPermissions(formattedPermissions);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tải dữ liệu';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        permissions,
        modules,
        isLoading,
        error,
        refetch: fetchData,
        collapsedModules,
        setCollapsedModules,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
}

