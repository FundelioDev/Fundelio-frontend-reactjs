import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const StatisticsSection = () => {
  const sectionRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const numbersRef = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { value: 15000, prefix: '', suffix: '+', label: 'Dự án được tài trợ' },
    { value: 125, prefix: '$', suffix: 'M+', label: 'Tổng vốn gọi được' },
    { value: 500000, prefix: '', suffix: '+', label: 'Nhà đầu tư' },
    { value: 98, prefix: '', suffix: '%', label: 'Tỷ lệ hài lòng' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate counters on mount
      if (!hasAnimated) {
        setHasAnimated(true);
        setTimeout(() => {
          animateCounters();
        }, 500);
      }

      // Background slow rotation
      gsap.to('.stat-bg', {
        rotation: 10,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  useEffect(() => {
    const onThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const element = numbersRef.current[index];
      if (!element) return;

      const obj = { value: 0 };
      gsap.to(obj, {
        value: stat.value,
        duration: 2.5,
        ease: 'power2.out',
        delay: index * 0.2,
        onUpdate: () => {
          const formatted =
            stat.suffix === '%' || stat.value < 100
              ? obj.value.toFixed(0)
              : Math.floor(obj.value).toLocaleString();
          element.textContent = formatted;
        },
      });
    });
  };

  return (
    <section
      ref={sectionRef}
      className='relative h-full py-12 lg:py-16 bg-background text-foreground overflow-hidden flex items-center'
    >
      {/* Reusable background */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1400}
        radius={320}
        lineWidth={1}
      />
      {/* Large Background Numbers */}
      <div className='stat-bg absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none'>
        <div className='text-[40vh] font-bold'>
          {stats.map((stat, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-60' />

      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10'>
        {/* Title */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4'>
            Con số
            <br />
            nói lên tất cả
          </h2>
          <p className='text-base md:text-lg text-muted-foreground max-w-2xl mx-auto'>
            Hàng ngàn startup đã tin tưởng và thành công cùng Fundelio
          </p>
        </div>

        {/* Stats Grid - Compact */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {stats.map((stat, index) => (
            <div key={index} className='group text-center'>
              {/* Number */}
              <div className='mb-4 overflow-hidden'>
                <div className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter'>
                  {stat.prefix}
                  <span ref={(el) => (numbersRef.current[index] = el)}>0</span>
                  {stat.suffix}
                </div>
              </div>

              {/* Label */}
              <div className='text-sm md:text-base text-muted-foreground uppercase tracking-wider'>
                {stat.label}
              </div>

              {/* Decorative Line */}
              <div className='mt-4 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent' />
            </div>
          ))}
        </div>

        {/* Trust Logos - Compact */}
        <div className='mt-12 lg:mt-16 text-center'>
          <p className='text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6'>
            Được tin tưởng bởi
          </p>
          <div className='flex flex-wrap justify-center items-center gap-8 opacity-40'>
            {[
              'TechCrunch',
              'Forbes',
              'VnExpress',
              'Bloomberg',
              'The Verge',
            ].map((brand, index) => (
              <div
                key={index}
                className='text-base md:text-lg font-bold tracking-tight hover:opacity-100 transition-opacity cursor-pointer'
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
