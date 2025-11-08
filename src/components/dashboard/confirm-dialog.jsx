import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  desc,
  handleConfirm,
  disabled = false,
  className,
  children,
}) {
  const handleConfirmClick = async () => {
    if (!disabled) {
      await handleConfirm?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {desc && <AlertDialogDescription>{desc}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children && <div className="py-4">{children}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmClick}
            disabled={disabled}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

