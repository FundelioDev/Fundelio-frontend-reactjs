import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { MoveRight, MoveLeft, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Check state để xác định mode (login hoặc register)
  const initialMode = location.state?.mode === 'register' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình khi component được mount hoặc khi resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Kiểm tra ngay khi component mount
    checkScreenSize();

    // Thêm event listener để theo dõi resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Update isLogin khi location.state thay đổi
  useEffect(() => {
    if (location.state?.mode === 'register') {
      setIsLogin(false);
    } else if (location.state?.mode === 'login') {
      setIsLogin(true);
    }
  }, [location.state]);

  return (
    <div className='relative w-full h-full flex'>
      {/* Mobile navigation tabs */}
      {isMobile && (
        <div className='max-w-[100vw] w-full fixed top-14 sm:top-16 left-0 right-0 z-40 flex justify-center py-3 px-4 bg-background/70 backdrop-blur-xl border-b border-border/30'>
          <div className='flex gap-1.5 p-1.5 rounded-2xl bg-muted/30 border border-border/20'>
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              size='sm'
              className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? 'text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                ...(isLogin && {
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(135deg, rgba(8, 148, 226, 0.9), rgba(255, 183, 0, 0.9))'
                      : 'linear-gradient(135deg, rgba(8, 148, 226, 1), rgba(255, 183, 0, 1))',
                }),
              }}
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              size='sm'
              className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? 'text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                ...(!isLogin && {
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(135deg, rgba(8, 148, 226, 0.9), rgba(255, 183, 0, 0.9))'
                      : 'linear-gradient(135deg, rgba(8, 148, 226, 1), rgba(255, 183, 0, 1))',
                }),
              }}
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      )}

      {/* Forms container */}
      <div className='relative w-full flex flex-col lg:flex-row mt-28 lg:mt-0'>
        {/* Left side - Forms */}
        <div className='w-full lg:w-1/2 p-6 md:p-10 lg:p-14 xl:p-16 overflow-y-auto overflow-x-hidden'>
          <AnimatePresence mode='wait'>
            {isLogin || !isMobile ? (
              <motion.div
                key='login'
                initial={{ x: isMobile ? 0 : -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? 0 : 30, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={isMobile && !isLogin ? 'hidden' : ''}
              >
                <LoginForm />
                {isMobile && isLogin && (
                  <motion.div
                    className='mt-6 text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* <Button
                      variant='link'
                      onClick={() => navigate('/auth/forgot-password')}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      <Lock className='w-4 h-4 mr-2' />
                      Quên mật khẩu?
                    </Button> */}
                  </motion.div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right side - Forms */}
        <div className='w-full lg:w-1/2 p-6 md:p-10 lg:p-14 xl:p-16 overflow-y-auto overflow-x-hidden'>
          <AnimatePresence mode='wait'>
            {!isLogin || isMobile ? (
              <motion.div
                key='register'
                initial={{ x: isMobile ? 0 : 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? 0 : -30, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={isMobile && isLogin ? 'hidden' : ''}
              >
                <RegisterForm />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Overlay - Desktop only */}
        {!isMobile && (
          <motion.div
            className='absolute top-0 w-1/2 h-full backdrop-blur-lg shadow-2xl overflow-hidden'
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(8, 148, 226, 0.4) 0%, rgba(77, 195, 241, 0.35) 30%, rgba(255, 183, 0, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(8, 148, 226, 0.95) 0%, rgba(38, 176, 234, 0.95) 30%, rgba(255, 183, 0, 0.95) 100%)',
              boxShadow:
                theme === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  : '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 183, 0, 0.1)',
            }}
            initial={false}
            animate={{
              x: isLogin ? '100%' : '0%',
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 35,
            }}
          >
            {/* Dark overlay for dark mode */}
            {theme === 'dark' && (
              <div className='absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60' />
            )}
            {/* Desktop Form Content */}
            <div className='relative h-full flex flex-col items-center justify-center gap-10 p-8 z-10'>
              <div className='text-center space-y-5 text-white max-w-md'>
                <motion.h2
                  className='text-4xl xl:text-5xl font-bold tracking-tight'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {isLogin ? 'Chào mừng trở lại!' : 'Chào mừng bạn mới!'}
                </motion.h2>
                <div className='space-y-3'>
                  <motion.p
                    className='text-white/95 text-base'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  </motion.p>
                  <motion.p
                    className='text-white font-semibold text-lg'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isLogin ? 'Tạo tài khoản mới ngay' : 'Đăng nhập ngay'}
                  </motion.p>
                </div>
              </div>

              <div className='flex flex-col gap-5'>
                <motion.div
                  className='relative'
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    variant='outline'
                    size='lg'
                    className={`w-[200px] h-[56px] rounded-2xl backdrop-blur-sm transition-all duration-300 text-white text-base font-medium overflow-hidden shadow-lg ${
                      theme === 'dark'
                        ? 'border-white/70 bg-white/20 hover:border-white hover:bg-white/30 hover:shadow-2xl'
                        : 'border-white/50 bg-white/15 hover:border-white/80 hover:bg-white/25 hover:shadow-2xl'
                    }`}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    <div className='relative w-full h-full flex items-center justify-center'>
                      {isLogin ? (
                        <MoveRight className='w-6 h-6 animate-[pointing_1s_ease-in-out_infinite]' />
                      ) : (
                        <MoveLeft className='w-6 h-6 animate-[pointing_1s_ease-in-out_infinite]' />
                      )}
                    </div>
                  </Button>
                </motion.div>

                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* <Button
                      variant='ghost'
                      size='sm'
                      className='text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200'
                      onClick={() => navigate('/auth/forgot-password')}
                    >
                      <Lock className='w-4 h-4 mr-2' />
                      Quên mật khẩu?
                    </Button> */}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Thêm keyframes cho animation pointing vào file CSS của bạn
const style = document.createElement('style');
style.textContent = `
  @keyframes pointing {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);
