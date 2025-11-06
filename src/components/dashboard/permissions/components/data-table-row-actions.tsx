import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { Permission } from '../data/schema';
import { usePermissions } from '../context/permissions-context';
import { useLanguage } from '@/contexts/language-context';

interface DataTableRowActionsProps<TData extends Permission> {
  row: Row<TData>;
  onDelete?: (permission: TData) => void;
}

export function DataTableRowActions<TData extends Permission>({
  row,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const { t } = useLanguage();
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
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{t('permissionEdit')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('edit');
          }}
        >
          {t('permissionEdit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('delete');
          }}
          className="text-destructive"
        >
          {t('permissionDelete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
