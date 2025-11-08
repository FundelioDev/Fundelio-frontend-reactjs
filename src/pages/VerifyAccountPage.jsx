import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/authApi';

export const VerifyAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setError('Token không hợp lệ');
        setIsLoading(false);
        return;
      }

      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;

      try {
        const response = await authApi.verifyEmail({ token });

        if (response && response.data) {
          setIsSuccess(true);
        }
      } catch (err) {
        console.error('Verify account error:', err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          'Không thể xác nhận tài khoản. Token có thể đã hết hạn hoặc không hợp lệ.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccount();
  }, [token]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100/30 to-secondary-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full bg-background rounded-2xl shadow-2xl p-8 text-center space-y-6'
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto'
          >
            <Loader2 className='w-8 h-8 text-primary' />
          </motion.div>
          <h2 className='text-2xl font-bold text-foreground'>
            Đang xác nhận tài khoản
          </h2>
          <p className='text-muted-foreground'>
            Vui lòng đợi trong giây lát...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100/30 to-secondary-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full bg-background rounded-2xl shadow-2xl p-8 text-center space-y-4'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className='w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto'>
              <AlertCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
            </div>
          </motion.div>
          <h2 className='text-2xl font-bold text-foreground'>
            Xác nhận thất bại
          </h2>
          <p className='text-muted-foreground'>{error}</p>
          <div className='pt-4 space-y-3'>
            <Link to='/auth'>
              <Button className='w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'>
                Quay lại đăng nhập
              </Button>
            </Link>
            <Link to='/auth' state={{ mode: 'register' }}>
              <Button variant='outline' className='w-full rounded-xl'>
                Đăng ký lại
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100/30 to-secondary-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full bg-background rounded-2xl shadow-2xl p-8 text-center space-y-4'
        >
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
            <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto'>
              <CheckCircle2 className='w-10 h-10 text-green-600 dark:text-green-400' />
            </div>
          </motion.div>
          <h2 className='text-2xl font-bold text-foreground'>
            Xác nhận tài khoản thành công!
          </h2>
          <p className='text-muted-foreground'>
            Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
          </p>
          <div className='bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground space-y-2 mt-4'>
            <p className='flex items-center justify-center gap-2'>
              <Mail className='w-4 h-4' />
              Email của bạn đã được xác nhận
            </p>
          </div>
          <div className='pt-4'>
            <Link to='/auth' state={{ mode: 'login' }}>
              <Button className='w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'>
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

