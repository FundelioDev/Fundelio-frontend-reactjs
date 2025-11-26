'use client';

import { useState, useMemo } from 'react';
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
import { useColumns } from './users-columns';
import { cn } from '@/lib/utils';

export function UsersTable({ data }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  console.log('UsersTable received data:', data);
  console.log(
    'Data length:',
    Array.isArray(data) ? data.length : 'không phải mảng'
  );
  console.log('Data type:', typeof data);

  if (Array.isArray(data) && data.length > 0) {
    console.log('Kiểm tra item đầu tiên:', JSON.stringify(data[0], null, 2));
    console.log('Item có userId?', data[0]?.userId ? 'Có' : 'Không');
    console.log('Item có email?', data[0]?.email ? 'Có' : 'Không');
    console.log('Item có firstName?', data[0]?.firstName ? 'Có' : 'Không');
    console.log('Item có lastName?', data[0]?.lastName ? 'Có' : 'Không');
    console.log(
      'Item có roles?',
      Array.isArray(data[0]?.roles) ? 'Có' : 'Không'
    );
  }

  if (Array.isArray(data) && data.length > 0) {
    console.log('Chi tiết người dùng đầu tiên:', {
      userId: data[0].userId,
      email: data[0].email,
      firstName: data[0].firstName,
      lastName: data[0].lastName,
      hasRoles: Array.isArray(data[0].roles),
      isVerified: data[0].isVerified,
    });
  }

  const validData = useMemo(() => {
    const filtered = Array.isArray(data)
      ? data.filter((user) => user && typeof user === 'object' && user.userId)
      : [];
    console.log('Valid data after filtering:', filtered);
    console.log('Valid data length:', filtered.length);
    if (filtered.length === 0 && Array.isArray(data) && data.length > 0) {
      console.log(
        'Dữ liệu bị lọc hết. Kiểm tra cấu trúc dữ liệu đầu tiên:',
        data[0]
      );
    }
    return filtered;
  }, [data]);

  const columns = useColumns();

  const table = useReactTable({
    data: validData,
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <DataTableToolbar table={table} />
      </div>
      <div className="flex-1 min-h-0 rounded-md border border-slate-300 dark:border-slate-600 shadow-sm overflow-hidden dark:bg-zinc-800">
        {(() => {
          try {
            console.log('Table rows length:', table.getRowModel().rows?.length);
            return (
              <Table className="h-full">
                <TableHeader className="bg-slate-50 dark:bg-zinc-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-slate-300 dark:border-slate-600"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="font-semibold text-slate-700 dark:text-slate-200 truncate"
                        >
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
                <TableBody className="overflow-hidden">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default "
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              cell.column.id === 'avatar' && 'text-center',
                              'py-3 break-words dark:text-slate-200',
                              cell.column.id === 'email' &&
                                'max-w-[200px] truncate',
                              cell.column.id === 'firstName' &&
                                'max-w-[150px] truncate',
                              cell.column.id === 'lastName' &&
                                'max-w-[150px] truncate',
                              cell.column.id === 'roles' && 'max-w-[200px]',
                              cell.column.id === 'createdAt' &&
                                'max-w-[180px] truncate',
                              cell.column.id === 'isVerified' &&
                                'max-w-[130px] truncate'
                            )}
                          >
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
                        className="h-24 text-center text-slate-500 dark:text-slate-400"
                      >
                        Không tìm thấy kết quả
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            );
          } catch (error) {
            console.error('Lỗi khi hiển thị bảng:', error);
            return (
              <div className="p-8 text-center text-red-500">
                <p>Đã xảy ra lỗi khi hiển thị dữ liệu.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Vui lòng thử làm mới trang.
                </p>
              </div>
            );
          }
        })()}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

