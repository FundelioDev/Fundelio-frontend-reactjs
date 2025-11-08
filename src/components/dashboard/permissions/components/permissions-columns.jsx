import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header.jsx';
import { DataTableRowActions } from './data-table-row-actions';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const createColumns = (expandedModules, onDelete) => {
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
        <DataTableColumnHeader column={column} title="Tên permission" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        if (item.type === 'module') {
          return (
            <div className="flex items-center gap-2">
              <ChevronRight
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
        return <div className="font-medium text-text-primary dark:text-white transition-colors duration-300">{item.name}</div>;
      },
    },
    {
      accessorKey: 'apiPath',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đường dẫn API" />
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
          const permission = {
            permissionId: row.original.permissionId,
            name: row.original.name,
            apiPath: row.original.apiPath || '',
            httpMethod: row.original.httpMethod || 'GET',
            module: row.original.module || '',
            createdAt: row.original.createdAt || '',
            updatedAt: row.original.updatedAt || '',
            createdBy: row.original.createdBy || '',
          };

          const handleDelete = () => onDelete(permission);

          return (
            <DataTableRowActions
              row={row}
              onDelete={handleDelete ? () => handleDelete() : undefined}
            />
          );
        }
        return null;
      },
    },
  ];
};

