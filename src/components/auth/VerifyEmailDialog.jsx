import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export const VerifyEmailDialog = ({ open, onOpenChange, email }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-gray-800'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='p-6'
        >
          <div className='flex flex-col items-center text-center space-y-4 py-4'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
            >
              <div className='w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center'>
                <Mail className='w-10 h-10 text-primary' />
              </div>
            </motion.div>

            <div className='space-y-2'>
              <DialogTitle className='text-2xl font-bold'>
                Kiểm tra email của bạn
              </DialogTitle>
              <DialogDescription className='text-base'>
                Chúng tôi đã gửi email xác nhận đến
                <br />
                <span className='font-semibold text-foreground'>
                  {email}
                </span>
              </DialogDescription>
            </div>

            <div className='bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground space-y-2 w-full'>
              <p>📧 Vui lòng kiểm tra hộp thư đến của bạn.</p>
              <p>
                Bấm vào liên kết trong email để kích hoạt tài khoản của bạn.
              </p>
              <p className='pt-2'>
                Không thấy email?{' '}
                <button
                  onClick={handleClose}
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline'
                >
                  Kiểm tra thư mục spam
                </button>
              </p>
            </div>

            <DialogFooter className='w-full pt-4'>
              <Button
                onClick={handleClose}
                className='w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'
              >
                Đã hiểu
              </Button>
            </DialogFooter>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

