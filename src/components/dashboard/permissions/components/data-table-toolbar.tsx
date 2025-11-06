import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { PermissionsPrimaryButtons } from './permissions-primary-buttons';
import { useLanguage } from '@/contexts/language-context';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t('permissionSearchPlaceholder')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <PermissionsPrimaryButtons />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
