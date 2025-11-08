import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export function DataTablePagination({ table }) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground dark:text-text-white transition-colors duration-300'>
        Hiển thị{' '}
        {table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
          1}{' '}
        đến{' '}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{' '}
        của {table.getFilteredRowModel().rows.length} bản ghi
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium text-text-primary dark:text-white transition-colors duration-300'>
            Số hàng mỗi trang
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px] bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent
              side='top'
              className='bg-white dark:bg-darker-2 border-border transition-colors duration-300'
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className='text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300'
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium text-text-primary dark:text-white transition-colors duration-300'>
          Trang {table.getState().pagination.pageIndex + 1} của{' '}
          {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Trang đầu</span>
            <ChevronsLeft className='h-4 w-4 text-text-primary dark:text-white transition-colors duration-300' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Trang trước</span>
            <ChevronLeft className='h-4 w-4 text-text-primary dark:text-white transition-colors duration-300' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Trang sau</span>
            <ChevronRight className='h-4 w-4 text-text-primary dark:text-white transition-colors duration-300' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Trang cuối</span>
            <ChevronsRight className='h-4 w-4 text-text-primary dark:text-white transition-colors duration-300' />
          </Button>
        </div>
      </div>
    </div>
  );
}
