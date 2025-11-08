import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

export function DataTableViewOptions({ table }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4 text-text-primary dark:text-white transition-colors duration-300" />
          <span className="text-text-primary dark:text-white transition-colors duration-300">Xem bảng</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] bg-white dark:bg-darker-2 border-border transition-colors duration-300">
        <DropdownMenuLabel className="text-text-primary dark:text-white transition-colors duration-300">Cột bảng</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border dark:bg-darker transition-colors duration-300" />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

