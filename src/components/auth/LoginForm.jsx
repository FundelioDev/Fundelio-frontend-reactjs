import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { AuthErrorDialog } from './AuthErrorDialog';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  const clearErrors = () => {
    setErrors({});
  };

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (!identifier || !password) {
      setErrors({
        identifier: !identifier ? 'Vui lòng nhập email hoặc số điện thoại' : '',
        password: !password ? 'Vui lòng nhập mật khẩu' : '',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = isEmail(identifier)
        ? { email: identifier, password }
        : { phoneNumber: identifier, password };

      const response = await authApi.login(payload);

      if (response && response.data) {
        const accessToken = response.data.data.accessToken;
        const userSecured = response.data.data.userSecured;
        if (accessToken) {
          login(accessToken, userSecured);
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);

      const apiErrors = error?.errors;
      const fallbackMessage =
        error?.response?.data?.message ||
        (Array.isArray(apiErrors) && apiErrors[0]?.message) ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const combinedMessage = apiErrors
          .map((e) => e?.message)
          .filter(Boolean)
          .join('\n');
        const finalMsg = combinedMessage || fallbackMessage;
        setErrors({ general: finalMsg });
        setErrorDialogMessage(finalMsg);
        setShowErrorDialog(true);
      } else {
        setErrors({ general: fallbackMessage });
        setErrorDialogMessage(fallbackMessage);
        setShowErrorDialog(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='w-full'
    >
      <Card className='w-full mx-auto backdrop-blur-sm bg-transparent border-none shadow-none'>
        <CardHeader className='space-y-2 pb-6'>
          <CardTitle className='text-3xl md:text-4xl font-bold text-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 bg-clip-text text-transparent'>
            Đăng nhập
          </CardTitle>
          <p className='text-center text-sm text-muted-foreground'>
            Chào mừng bạn quay trở lại
          </p>
        </CardHeader>
        <CardContent className='px-2 md:px-4'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-4'>
              <motion.div
                className='space-y-2'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label
                  htmlFor='login-identifier'
                  className='text-sm md:text-base font-medium'
                >
                  Email hoặc Số điện thoại
                </Label>
                <Input
                  id='login-identifier'
                  type='text'
                  placeholder='example@email.com'
                  autoComplete='off'
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    clearErrors();
                  }}
                  disabled={isLoading}
                  className={`transition-all duration-200 text-sm md:text-base h-11 px-4 rounded-xl border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    errors.identifier
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                />
                {errors.identifier && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-xs md:text-sm text-red-500'
                  >
                    {errors.identifier}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className='space-y-2'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label
                  htmlFor='login-password'
                  className='text-sm md:text-base font-medium'
                >
                  Mật khẩu
                </Label>
                <div className='relative'>
                  <Input
                    id='login-password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearErrors();
                    }}
                    disabled={isLoading}
                    className={`transition-all duration-200 text-sm md:text-base h-11 px-4 pr-11 rounded-xl border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : ''
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-xs md:text-sm text-red-500'
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className='flex justify-end'
            >
              <button
                type='button'
                onClick={() => setShowForgotPassword(true)}
                tabIndex={-1}
                className='text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline underline-offset-2 transition-colors'
              >
                Quên mật khẩu?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='pt-2'
            >
              <Button
                type='submit'
                className='w-full h-12 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg text-sm md:text-base font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'
                disabled={isLoading}
                onClick={(e) => e.stopPropagation()}
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
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />

      {/* Common Error Dialog */}
      <AuthErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title='Đăng nhập thất bại'
        message={errorDialogMessage}
      />
    </motion.div>
  );
};
