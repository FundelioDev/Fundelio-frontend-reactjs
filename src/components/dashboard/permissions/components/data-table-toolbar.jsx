import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { PermissionsPrimaryButtons } from './permissions-primary-buttons';

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm permission..."
          value={(table.getColumn('name')?.getFilterValue()) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300"
        />
      </div>
      <div className="flex items-center space-x-2">
        <PermissionsPrimaryButtons />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

