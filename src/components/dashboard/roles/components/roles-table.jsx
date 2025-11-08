import { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { useRoles } from '../context/roles-context';
import { useColumns } from './roles-columns';

export function RolesTable({
  data,
}) {
  const columns = useColumns();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { meta, fetchRoles } = useRoles();

  // Initialize table with empty data if data is undefined
  const tableData = data || [];

  useEffect(() => {
    if (columns && tableData) {
      setIsLoading(false);
    }
  }, [columns, tableData]);

  const table = useReactTable({
    data: tableData,
    columns: columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-border bg-white dark:bg-darker-2 transition-colors duration-300">
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50/50 dark:bg-darker-2/30 transition-colors duration-300'>
                <TableHead className="h-24 text-center text-text-primary dark:text-white transition-colors duration-300">
                  Đang tải...
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border border-border bg-white dark:bg-darker-2 transition-colors duration-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-gray-50/50 dark:bg-darker-2/30 border-b border-border transition-colors duration-300'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className='text-text-primary dark:text-white transition-colors duration-300'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-gray-50 dark:hover:bg-darker-2/50 transition-colors duration-300'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='text-text-primary dark:text-white transition-colors duration-300'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-text-primary dark:text-white transition-colors duration-300"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        totalPages={meta?.totalPages || 1}
        onPageChange={(page) => fetchRoles(page)}
      />
    </div>
  );
}

