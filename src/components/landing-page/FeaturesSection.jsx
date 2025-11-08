import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const titleRef = useRef(null);
  const itemsRef = useRef([]);

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

      // Items stagger entrance
      gsap.fromTo(
        itemsRef.current,
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

  // Lắng nghe thay đổi theme để đồng bộ nền/sắc độ
  useEffect(() => {
    const onThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  const features = [
    {
      number: '01',
      title: 'Tự động hóa toàn diện',
      description:
        'Quy trình gọi vốn được tự động hóa hoàn toàn từ đầu đến cuối, giúp bạn tập trung vào phát triển sản phẩm.',
    },
    {
      number: '02',
      title: 'Minh bạch tuyệt đối',
      description:
        'Mọi giao dịch được ghi nhận và hiển thị real-time, tạo niềm tin tuyệt đối cho nhà đầu tư.',
    },
    // {
    //   number: '03',
    //   title: 'AI phân tích thông minh',
    //   description:
    //     'Công nghệ AI giúp dự đoán xu hướng đầu tư và tối ưu chiến lược campaign của bạn.',
    // },
    {
      number: '03',
      title: 'Tích hợp đa nền tảng',
      description:
        'Kết nối liền mạch với các hệ thống thanh toán, marketing và quản lý dự án hiện có.',
    },
    {
      number: '04',
      title: 'Phân tích dự đoán',
      description:
        'Dashboard analytics với khả năng dự đoán xu hướng và tối ưu hóa hiệu suất campaign.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className='relative h-full py-12 lg:py-16 text-foreground overflow-hidden flex items-center bg-background'
    >
      {/* Reusable BlackHole background (nền sáng) */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1200}
        radius={280}
        lineWidth={1}
        lensOpacity={0.35}
      />

      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10'>
        {/* Title */}
        <div ref={titleRef} className='mb-8 lg:mb-12'>
          <h2 className='text-2xl sm:text-hero md:text-5xl lg:text-6xl font-bold leading-tight'>
            Nền tảng cho{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600'>
              tương lai
            </span>
          </h2>
        </div>

        {/* Features List - Compact */}
        <div className='space-y-4 max-h-[65vh] overflow-y-auto scrollbar-hide'>
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className='group relative border-t border-border hover:border-primary-500 transition-colors duration-300'
            >
              <div className='py-6 grid md:grid-cols-12 gap-4 items-center'>
                {/* Number */}
                <div className='md:col-span-2'>
                  <div className='text-4xl md:text-5xl font-bold text-foreground/20 group-hover:text-primary-500 transition-colors duration-300'>
                    {feature.number}
                  </div>
                </div>

                {/* Content */}
                <div className='md:col-span-8'>
                  <h3 className='text-xl md:text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors'>
                    {feature.title}
                  </h3>
                  <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                    {feature.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className='md:col-span-2 flex justify-end'>
                  <div className='w-12 h-12 rounded-full border-2 border-border group-hover:border-primary-500 group-hover:bg-primary-500 flex items-center justify-center transition-all duration-300'>
                    <svg
                      className='w-5 h-5 text-muted-foreground group-hover:text-white transition-colors transform group-hover:translate-x-1'
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

              {/* Progress Bar */}
              <div className='absolute bottom-0 left-0 h-0.5 bg-primary-500 w-0 group-hover:w-full transition-all duration-700' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
