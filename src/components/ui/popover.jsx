import * as React from 'react';
import { cn } from '@/lib/utils';

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const Popover = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = React.useCallback((newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ asChild, children, className, ...props }, ref) => {
  const { setOpen, open } = React.useContext(PopoverContext);

  const handleClick = (e) => {
    setOpen(!open);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <div ref={ref} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef(
  ({ className, align = 'center', children, ...props }, ref) => {
    const { open } = React.useContext(PopoverContext);
    const contentRef = React.useRef(null);

    React.useEffect(() => {
      if (open && contentRef.current) {
        const trigger = contentRef.current.previousElementSibling;
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          const content = contentRef.current;
          content.style.position = 'absolute';
          content.style.top = `${rect.bottom + 4}px`;
          content.style.left = `${rect.left}px`;
          if (align === 'end') {
            content.style.left = 'auto';
            content.style.right = `${window.innerWidth - rect.right}px`;
          } else if (align === 'start') {
            content.style.left = `${rect.left}px`;
            content.style.right = 'auto';
          }
        }
      }
    }, [open, align]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'z-50 rounded-md border bg-white dark:bg-darker p-1 text-popover-foreground shadow-md outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };

