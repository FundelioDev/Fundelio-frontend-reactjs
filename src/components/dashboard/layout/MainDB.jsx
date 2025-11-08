'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Main({ className, fixed, children, ...props }) {
  return (
    <main
      className={cn(
        'flex flex-1 flex-col',
        fixed ? 'container' : 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}

Main.displayName = 'Main'; 