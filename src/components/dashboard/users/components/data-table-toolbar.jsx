import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar({
  table,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2 overflow-hidden">
        <Input
          placeholder="Tìm kiếm theo email..."
          value={(table.getColumn('email')?.getFilterValue()) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] truncate"
        />
        <div className="flex gap-x-2 flex-wrap">
          {table.getColumn('isVerified') && (
            <DataTableFacetedFilter
              column={table.getColumn('isVerified')}
              title="Trạng thái xác minh"
              options={[
                { label: 'Đã xác minh', value: 'true' },
                { label: 'Chưa xác minh', value: 'false' },
              ]}
            />
          )}
          {table.getColumn('roles') && (
            <DataTableFacetedFilter
              column={table.getColumn('roles')}
              title="Vai trò"
              options={[
                { label: 'ADMIN', value: 'ADMIN' },
                { label: 'USER', value: 'USER' },
              ]}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 truncate"
          >
            Đặt lại
            <Cross2Icon className="ml-2 h-4 w-4 flex-shrink-0" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

