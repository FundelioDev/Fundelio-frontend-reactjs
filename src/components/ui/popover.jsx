import * as React from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: null,
});

const Popover = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = React.useCallback((newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        const content = document.querySelector('[data-popover-content]');
        if (content && !content.contains(event.target)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ asChild, children, className, ...props }, ref) => {
  const { setOpen, open, triggerRef } = React.useContext(PopoverContext);
  const combinedRef = React.useCallback((node) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref, triggerRef]);

  const handleClick = (e) => {
    setOpen(!open);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: combinedRef,
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <div ref={combinedRef} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef(
  ({ className, align = 'start', children, ...props }, ref) => {
    const { open, triggerRef } = React.useContext(PopoverContext);
    const contentRef = React.useRef(null);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = React.useState(false);

    React.useEffect(() => {
      if (!open || !triggerRef.current) {
        setIsPositioned(false);
        return;
      }

      // Delay để đảm bảo content đã render
      const timeoutId = setTimeout(() => {
        if (contentRef.current && triggerRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const contentRect = contentRef.current.getBoundingClientRect();
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;

          let top = triggerRect.bottom + scrollY + 4;
          let left = triggerRect.left + scrollX;

          if (align === 'end') {
            left = triggerRect.right + scrollX - contentRect.width;
          } else if (align === 'center') {
            left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
          }

          // Đảm bảo không bị tràn ra ngoài viewport
          if (left + contentRect.width > window.innerWidth + scrollX) {
            left = window.innerWidth + scrollX - contentRect.width - 8;
          }
          if (left < scrollX) {
            left = scrollX + 8;
          }

          setPosition({ top, left });
          setIsPositioned(true);
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [open, align, triggerRef]);

    React.useEffect(() => {
      if (!open) {
        setIsPositioned(false);
      }
    }, [open]);

    if (!open) return null;

    return createPortal(
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        data-popover-content
        className={cn(
          'fixed z-50 rounded-md border bg-white dark:bg-darker p-1 text-popover-foreground shadow-md outline-none',
          !isPositioned && 'opacity-0',
          className
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };

