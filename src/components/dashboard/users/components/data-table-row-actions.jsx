import { IconEdit, IconTrash, IconUserSearch } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useUsers } from '../context/users-context';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DataTableRowActions({ row }) {
  const { setOpen, setCurrentRow } = useUsers();

  // Kiểm tra tính hợp lệ của dữ liệu hàng
  const isValidRow = () => {
    try {
      const user = row.original;
      return !!(user && typeof user === 'object' && user.userId);
    } catch (error) {
      console.error('Có lỗi xảy ra', error);
      return false;
    }
  };

  const handleView = () => {
    if (!isValidRow()) return;
    setCurrentRow(row.original);
    setOpen('view');
  };

  const handleEdit = () => {
    if (!isValidRow()) return;
    setCurrentRow(row.original);
    setOpen('edit');
  };

  const handleDelete = () => {
    if (!isValidRow()) return;
    setCurrentRow(row.original);
    setOpen('delete');
  };

  return (
    <div className='flex items-center justify-end gap-1'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleView}
              className='h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-colors rounded-full'
              disabled={!isValidRow()}
            >
              <IconUserSearch className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='top'
            className='bg-slate-800 text-white max-w-[200px]'
          >
            <p className='truncate'>Xem chi tiết</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleEdit}
              className='h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700 transition-colors rounded-full'
              disabled={!isValidRow()}
            >
              <IconEdit className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='top'
            className='bg-slate-800 text-white max-w-[200px]'
          >
            <p className='truncate'>Chỉnh sửa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleDelete}
              className='h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-colors rounded-full'
              disabled={!isValidRow()}
            >
              <IconTrash className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='top'
            className='bg-slate-800 text-white max-w-[200px]'
          >
            <p className='truncate'>Xóa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
