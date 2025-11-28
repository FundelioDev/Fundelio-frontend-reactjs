import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import bgAuth from '../../public/images/bg.png';
import bgDark from '../../public/images/bg_dark.png';
import { useTheme } from '@/contexts/ThemeContext';
import { Header } from '@/components/common/Header';

export const AuthLayout = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const isAuthRootPage = location.pathname === '/auth';

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    // Kiểm tra kích thước màn hình khi component mount
    checkScreenSize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className='relative w-screen max-w-[100vw] overflow-x-hidden'>
      {/* AuthHeader với z-index cao hơn để đảm bảo hiển thị trên cùng */}
      <div className='z-[100] relative'>
        <Header variant='light' landing />
      </div>

      <motion.div
        className='min-h-screen w-screen max-w-[100vw] flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-500'
        style={{
          backgroundImage: `url(${theme === 'dark' ? bgDark : bgAuth})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress bar - more subtle */}
        <motion.div
          className='fixed top-0 left-0 right-0 h-0.5 origin-left z-50'
          style={{
            scaleX,
            background:
              theme === 'dark'
                ? 'linear-gradient(90deg, rgba(8, 148, 226, 0.8), rgba(255, 183, 0, 0.8))'
                : 'linear-gradient(90deg, rgba(8, 148, 226, 0.9), rgba(255, 183, 0, 0.9))',
          }}
        />

        {/* Mouse follower effect - more subtle */}
        {!isMobile && (
          <motion.div
            className='fixed w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0'
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{
              type: 'spring',
              damping: 40,
              stiffness: 150,
            }}
          />
        )}

        {/* Main content */}
        {isAuthRootPage ? (
          <motion.div
            className={`rounded-2xl md:rounded-3xl overflow-hidden flex relative border transition-all duration-300 ${isMobile
                ? 'w-[calc(100vw-2rem)] mx-4 h-auto min-h-[85vh] my-8'
                : isTablet
                  ? 'w-[90%] max-w-[800px] h-[600px]'
                  : 'w-[85%] max-w-[1150px] h-[680px] xl:h-[720px]'
              }`}
            style={{
              backgroundColor:
                theme === 'dark'
                  ? 'rgba(15, 15, 20, 0.65)'
                  : 'rgba(255, 255, 255, 0.90)',
              borderColor:
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.08)',
              boxShadow:
                theme === 'dark'
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(59, 130, 246, 0.1)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 80px rgba(59, 130, 246, 0.08)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className='w-full relative z-10'
            >
              {children || <Outlet />}
            </motion.div>

            {/* Background patterns - more subtle and modern */}
            <div className='absolute inset-0 -z-10 overflow-hidden opacity-40'>
              <div className='absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl' />
              <div className='absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl' />
            </div>
          </motion.div>
        ) : (
          // Nested auth routes (e.g., /auth/reset-password, /auth/verify-active-account)
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='w-full'
          >
            {children || <Outlet />}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
