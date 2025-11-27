import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // ACTIVE - Đang gây quỹ: Màu xanh dương (primary)
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90',
        // DRAFT, CANCELLED - Bản nháp, Đã hủy: Màu xám nhẹ
        secondary:
          'border-transparent bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted/70',
        // REJECTED, FAILED - Từ chối, Thất bại: Màu đỏ
        destructive:
          'border-transparent bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/80',
        // APPROVED, SUCCESSFUL - Đã duyệt, Thành công: Màu xanh lá
        success:
          'border-transparent bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600',
        // PENDING - Chờ duyệt: Màu vàng/cam cảnh báo
        warning:
          'border-transparent bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600',
        outline: 'text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
