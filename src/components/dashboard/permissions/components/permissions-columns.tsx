import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header.jsx';
import { DataTableRowActions } from './data-table-row-actions';
import { Permission } from '../data/schema';
import { IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Row } from '@tanstack/react-table';
import { useLanguage } from '@/contexts/language-context';

interface TableItem {
  id: string;
  name: string;
  type: 'module' | 'permission';
  apiPath?: string;
  httpMethod?: string;
  module?: string;
  children?: Permission[];
  permissionId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export const createColumns = (
  expandedModules: Record<string, boolean>,
  onDelete: (permission: Permission) => void,
  t: (key: string) => string
): ColumnDef<TableItem>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('permissionName')} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        if (item.type === 'module') {
          return (
            <div className="flex items-center gap-2">
              <IconChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  expandedModules[item.id] && 'rotate-90'
                )}
              />
              <Badge variant="outline" className="font-semibold">
                {item.name}
              </Badge>
            </div>
          );
        }
        return <div className="font-medium">{item.name}</div>;
      },
    },
    {
      accessorKey: 'apiPath',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('permissionApiPath')} />
      ),
    },
    {
      accessorKey: 'httpMethod',
      header: 'HTTP Method',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue('httpMethod')}</Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        if (row.original.type === 'permission' && row.original.permissionId) {
          const permission: Permission = {
            permissionId: row.original.permissionId,
            name: row.original.name,
            apiPath: row.original.apiPath || '',
            httpMethod:
              (row.original.httpMethod as Permission['httpMethod']) || 'GET',
            module: row.original.module || '',
            createdAt: row.original.createdAt || '',
            updatedAt: row.original.updatedAt || '',
            createdBy: row.original.createdBy || '',
          };

          const handleDelete = () => onDelete(permission);

          return (
            <DataTableRowActions
              row={row as any}
              onDelete={handleDelete ? () => handleDelete() : undefined}
            />
          );
        }
        return null;
      },
    },
  ];
};
