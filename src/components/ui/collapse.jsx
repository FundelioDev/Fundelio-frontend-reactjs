import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

const Collapse = CollapsiblePrimitive.Root;

const CollapseTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    className={cn('flex items-center', className)}
    {...props}
  />
));
CollapseTrigger.displayName = 'CollapseTrigger';

const CollapseContent = React.forwardRef(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      'overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down',
      className
    )}
    {...props}
  />
));
CollapseContent.displayName = 'CollapseContent';

export { Collapse, CollapseTrigger, CollapseContent };
