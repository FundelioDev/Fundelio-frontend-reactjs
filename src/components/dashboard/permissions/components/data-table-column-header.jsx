import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function DataTableColumnHeader({ column, title, className }) {
  if (!column.getCanSort()) {
    return <div className={cn(className, 'text-text-primary dark:text-white transition-colors duration-300')}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-gray-100 dark:hover:bg-darker-2 text-text-primary dark:text-white transition-colors duration-300"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white dark:bg-darker-2 border-border transition-colors duration-300">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)} className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 dark:text-text-white transition-colors duration-300" />
            Sắp xếp tăng dần
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)} className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 dark:text-text-white transition-colors duration-300" />
            Sắp xếp giảm dần
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border dark:bg-darker transition-colors duration-300" />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)} className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 dark:text-text-white transition-colors duration-300" />
            Ẩn cột
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
