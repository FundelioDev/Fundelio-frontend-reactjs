import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Không có dữ liệu';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return dateStr || 'Không có dữ liệu';
  }
};

export const useColumns = () => {

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn dòng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên vai trò" />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mô tả" />
      ),
    },
    {
      accessorKey: 'permissions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quyền hạn" />
      ),
      cell: ({ row }) => {
        const permissions = row.getValue('permissions') ?? [];
        return <div>{permissions.length}</div>;
      },
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const active = row.getValue('active');
        return (
          <Badge
            variant="outline"
            className={
              active ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
            }
          >
            {active ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id);
        // Convert boolean to string for comparison
        const rowValueStr = String(rowValue);
        // value is an array of selected filter values
        if (Array.isArray(value)) {
          return value.includes(rowValueStr);
        }
        return value === rowValueStr;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue('createdAt');
        return formatDate(dateStr);
      },
    },
    {
      accessorKey: 'createdBy',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người tạo" />
      ),
    },
    {
      id: 'actions',
      cell: DataTableRowActions,
    },
  ];
};

