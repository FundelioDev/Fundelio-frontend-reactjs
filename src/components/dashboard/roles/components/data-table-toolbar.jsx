import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { RolesPrimaryButtons } from './roles-primary-buttons';
export function DataTableToolbar({
  table,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm..."
          value={(table.getColumn('name')?.getFilterValue() ?? '')}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('active') && (
          <DataTableFacetedFilter
            column={table.getColumn('active')}
            title="Trạng thái"
            options={[
              { label: 'Hoạt động', value: 'true' },
              { label: 'Không hoạt động', value: 'false' },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Đặt lại
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <RolesPrimaryButtons />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

