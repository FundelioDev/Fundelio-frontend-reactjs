import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordDialog = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // TODO: Implement actual forgot password API call
      console.log('Forgot password email:', email);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-gray-800'>
        <AnimatePresence mode='wait'>
          {!isSuccess ? (
            <motion.div
              key='form'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='p-6'
            >
              <DialogHeader className='space-y-3'>
                <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent'>
                  Quên mật khẩu?
                </DialogTitle>
                <DialogDescription className='text-base text-muted-foreground'>
                  Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại
                  mật khẩu.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className='space-y-5 mt-6'>
                <div className='space-y-2'>
                  <Label htmlFor='forgot-email' className='text-sm font-medium'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                    <Input
                      id='forgot-email'
                      type='email'
                      placeholder='example@email.com'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      disabled={isLoading}
                      className={`pl-10 h-11 rounded-xl transition-all duration-200 ${
                        error
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'focus:border-primary/60 focus:ring-2 focus:ring-primary/20'
                      }`}
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-sm text-red-500 flex items-center gap-1'
                    >
                      <span className='inline-block w-1 h-1 bg-red-500 rounded-full'></span>
                      {error}
                    </motion.p>
                  )}
                </div>

                <DialogFooter className='gap-3 sm:gap-2 pt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleClose}
                    disabled={isLoading}
                    className='rounded-xl'
                  >
                    Hủy
                  </Button>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-300'
                  >
                    {isLoading ? (
                      <span className='flex items-center gap-2'>
                        <svg
                          className='animate-spin h-4 w-4'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      'Gửi liên kết đặt lại'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key='success'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                  <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                    <CheckCircle2 className='w-10 h-10 text-green-600 dark:text-green-400' />
                  </div>
                </motion.div>

                <div className='space-y-2'>
                  <DialogTitle className='text-2xl font-bold'>
                    Kiểm tra email của bạn
                  </DialogTitle>
                  <DialogDescription className='text-base'>
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến
                    <br />
                    <span className='font-semibold text-foreground'>
                      {email}
                    </span>
                  </DialogDescription>
                </div>

                <div className='bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground space-y-2 w-full'>
                  <p>📧 Vui lòng kiểm tra hộp thư đến của bạn.</p>
                  <p>
                    Không thấy email?{' '}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className='text-primary-600 hover:text-primary-700 font-semibold hover:underline'
                    >
                      Gửi lại
                    </button>
                  </p>
                </div>

                <Button
                  onClick={handleClose}
                  className='w-full mt-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'
                >
                  Đã hiểu
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
