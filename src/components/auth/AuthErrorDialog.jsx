import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const AuthErrorDialog = ({ open, onOpenChange, title = 'Có lỗi xảy ra', message }) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden bg-background'>
        <div className='p-6'>
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
              <AlertCircle className='w-5 h-5 text-red-500' /> {title}
            </DialogTitle>
            <DialogDescription className='whitespace-pre-line text-foreground'>
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='pt-4'>
            <Button onClick={handleClose} className='rounded-xl'>Đóng</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};


