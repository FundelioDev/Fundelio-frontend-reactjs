import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { ScrollArea } from './scroll-area';

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

const CommandInput = React.forwardRef(
  ({ className, value, onValueChange, ...props }, ref) => {
    const handleChange = (e) => {
      onValueChange?.(e.target.value);
    };

    return (
      <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          className={cn(
            'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <ScrollArea className='max-h-[300px]'>
    <div
      ref={ref}
      className={cn('overflow-y-auto overflow-x-hidden p-1', className)}
      {...props}
    />
  </ScrollArea>
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
));
CommandSeparator.displayName = 'CommandSeparator';

const CommandItem = React.forwardRef(
  ({ className, onSelect, children, ...props }, ref) => {
    const handleClick = (e) => {
      onSelect?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = 'CommandItem';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};
