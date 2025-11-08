import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '../context/permissions-context';

export function DataTableRowActions({ row, onDelete }) {
  const { setOpen, setCurrentRow } = usePermissions();

  const handleEdit = () => {
    setCurrentRow(row.original);
    setOpen('edit');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row.original);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300"
        >
          <MoreHorizontal className="h-4 w-4 text-text-primary dark:text-white transition-colors duration-300" />
          <span className="sr-only">Chỉnh sửa</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-darker-2 border-border transition-colors duration-300">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('edit');
          }}
          className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300"
        >
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('delete');
          }}
          className="text-destructive dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-300"
        >
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

