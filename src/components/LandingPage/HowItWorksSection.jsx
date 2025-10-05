import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = [
    {
      number: '01',
      title: 'Đăng ký & Xác minh',
      description:
        'Tạo tài khoản và xác minh danh tính trong vài phút. Quy trình đơn giản, nhanh chóng.',
    },
    {
      number: '02',
      title: 'Tạo Campaign',
      description:
        'Thiết kế campaign với công cụ trực quan. Upload video, hình ảnh và mô tả dự án của bạn.',
    },
    {
      number: '03',
      title: 'Launch & Promote',
      description:
        'Công bố campaign và sử dụng công cụ marketing tích hợp để tiếp cận nhà đầu tư.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - smooth entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        }
      );
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
      className='relative h-full py-12 lg:py-16 overflow-hidden flex items-center bg-background text-foreground'
    >
      {/* Reusable background (nền sáng) */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1200}
        radius={280}
        lineWidth={1}
        lensOpacity={0.35}
      />
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10'>
        {/* Title */}
        <div ref={titleRef} className='mb-6 lg:mb-8'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
            Cách thức{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600'>
              hoạt động
            </span>
          </h2>
        </div>

        {/* Steps - Vertical Layout with Scroll */}
        <div className='space-y-4 max-h-[65vh] overflow-y-auto scrollbar-hide'>
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className='group relative bg-card border-2 border-border hover:border-primary-500 rounded-xl p-6 transition-all duration-500 hover:shadow-2xl'
            >
              {/* Background Gradient on Hover */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl' />

              <div className='relative flex items-start gap-4'>
                {/* Number - Left Side */}
                <div className='flex-shrink-0'>
                  <div className='w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all'>
                    <span className='text-2xl font-bold text-primary'>
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content - Right Side */}
                <div className='flex-1 pt-1'>
                  <h3 className='text-xl md:text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors'>
                    {step.title}
                  </h3>
                  <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className='flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <svg
                    className='w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform'
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
