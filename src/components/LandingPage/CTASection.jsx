import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const titleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from(titleRef.current.children, {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Button magnetic effect
      if (buttonRef.current) {
        const button = buttonRef.current;
        const handleMouseMove = (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const distance = Math.sqrt(x * x + y * y);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const power = (maxDistance - distance) / maxDistance;
            gsap.to(button, {
              x: x * power * 0.4,
              y: y * power * 0.4,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        sectionRef.current.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          sectionRef.current?.removeEventListener('mousemove', handleMouseMove);
          button?.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-foreground overflow-hidden'
    >
      {/* Reusable background (nền tối, mờ nhẹ để không lấn át gradient) */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1200}
        radius={260}
        lineWidth={1}
        lensOpacity={0.25}
      />

      <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center'>
        {/* Main Title - Compact */}
        <div ref={titleRef} className='mb-12'>
          <h2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight mb-6'>
            <div>Tương lai</div>
            <div>bắt đầu</div>
            <div className='text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50'>
              hôm nay
            </div>
          </h2>
        </div>

        {/* CTA Button - Magnetic */}
        <div className='flex justify-center mb-8'>
          <button
            ref={buttonRef}
            className='group relative px-10 py-5 bg-foreground text-background text-lg font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-foreground/20 transition-shadow'
          >
            <span className='relative z-10 flex items-center gap-2'>
              Bắt Đầu Ngay
              <svg
                className='w-5 h-5 transform group-hover:translate-x-2 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </span>

            {/* Hover effect */}
            <div className='absolute inset-0 bg-foreground opacity-0 group-hover:opacity-10 transition-opacity' />
          </button>
        </div>

        {/* Subtitle */}
        <p className='mb-8 text-base text-foreground/80 max-w-xl mx-auto'>
          Hàng ngàn nhà đầu tư đang chờ đợi để hỗ trợ dự án tiếp theo của bạn
        </p>

        {/* Trust Indicators - Compact */}
        <div className='flex flex-wrap justify-center items-center gap-8 text-foreground/60 text-xs'>
          <div className='flex items-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span>4.9/5 Rating</span>
          </div>
          <div className='flex items-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className='flex items-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent' />
    </section>
  );
};

export default CTASection;
