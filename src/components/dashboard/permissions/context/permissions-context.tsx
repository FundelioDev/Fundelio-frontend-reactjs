import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Permission } from '../data/schema';
import { permissionsApi } from '@/api-client';
import { useLanguage } from '@/contexts/language-context';

type DialogType = 'add' | 'edit' | 'delete' | null;

interface PermissionsContextType {
  open: DialogType;
  setOpen: (type: DialogType) => void;
  currentRow: Permission | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Permission | null>>;
  permissions: Permission[];
  modules: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface PermissionContextState {
  permissions: {
    permissionId: string;
    name: string;
    apiPath: string;
    httpMethod: string;
    module: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  // ... rest of the interface
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<Permission | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch modules
      const modulesResponse = await permissionsApi.getModules();
      if (modulesResponse.data.success) {
        setModules(modulesResponse.data.data);
      }

      // Fetch permissions
      const permissionsResponse = await permissionsApi.getPermissions({
        page: 1,
        size: 100,
      });
      if (permissionsResponse.data.success) {
        const permissions = permissionsResponse.data.data.content.map(
          (permission: Permission) => ({
            ...permission,
            module: permission.module || '',
            httpMethod: permission.httpMethod,
          })
        );
        setPermissions(permissions);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('errorLoadingData');
      setError(message);
      toast({
        variant: 'destructive',
        title: t('error'),
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
