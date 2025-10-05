import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const HeroLanding = () => {
  const heroRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const titleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const numbersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated numbers - giống Terminal Industries
      const createNumberAnimation = (element, delay = 0) => {
        const digits = '0123456789';
        let currentIndex = 0;

        const animate = () => {
          gsap.to(element, {
            textContent: digits[currentIndex],
            duration: 0.1,
            ease: 'none',
            onComplete: () => {
              currentIndex = (currentIndex + 1) % 10;
            },
          });
        };

        const interval = setInterval(animate, 100);

        setTimeout(() => {
          clearInterval(interval);
          gsap.to(element, {
            textContent: digits[Math.floor(Math.random() * 10)],
            duration: 0.5,
          });
        }, 3000 + delay);
      };

      numbersRef.current.forEach((num, index) => {
        if (num) createNumberAnimation(num, index * 200);
      });

      // Hero title split animation
      const titleChars = titleRef.current.querySelectorAll('.char');
      gsap.from(titleChars, {
        opacity: 0,
        y: 100,
        rotationX: -90,
        stagger: 0.02,
        duration: 1,
        ease: 'power4.out',
        delay: 0.5,
      });

      // Scroll indicator pulse
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0.3,
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  // (Background chuyển sang component BlackHoleBackground tái sử dụng)

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className='char inline-block'
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className='relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden'
    >
      {/* BlackHole reusable background */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1400}
        radius={320}
        lineWidth={1}
      />

      {/* Scrolling Numbers Background - Terminal Style */}
      <div className='absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none'>
        <div className='text-[40vh] font-bold tracking-tighter flex'>
          <span ref={(el) => (numbersRef.current[0] = el)}>0</span>
          <span ref={(el) => (numbersRef.current[1] = el)}>1</span>
          <span ref={(el) => (numbersRef.current[2] = el)}>2</span>
        </div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 text-center'>
        {/* Main Headline - Massive Typography */}
        <div ref={titleRef} className='mb-8'>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight'>
            {splitText('Chúng tôi đã')}
          </h1>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mt-3'>
            {splitText('tái định nghĩa')}
          </h1>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mt-3 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500'>
            {splitText('tương lai')}
          </h1>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mt-3'>
            {splitText('crowdfunding')}
          </h1>
        </div>

        {/* Subtitle - Minimal */}
        <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
          Kết nối startup với nhà đầu tư.
          <br />
          Biến ý tưởng thành hiện thực.
        </p>
      </div>

      {/* Scroll Indicator - Terminal Style */}
      <div
        ref={scrollIndicatorRef}
        className='absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center'
      >
        <div className='text-xs tracking-[0.3em] text-gray-400 mb-4'>
          SCROLL TO EXPLORE
        </div>
        <div className='w-px h-16 bg-gradient-to-b from-foreground to-transparent mx-auto' />
      </div>
    </section>
  );
};

export default HeroLanding;
