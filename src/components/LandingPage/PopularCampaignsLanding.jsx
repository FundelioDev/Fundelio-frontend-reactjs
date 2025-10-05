import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleBackground from '@/components/common/BlackHoleBackground';

gsap.registerPlugin(ScrollTrigger);

const PopularCampaignsLanding = () => {
  const sectionRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Auto-scroll marquee continuously
      if (marqueeRef.current) {
        const setupMarquee = () => {
          const width = marqueeRef.current.scrollWidth / 2;
          gsap.set(marqueeRef.current, { x: 0 });
          gsap.to(marqueeRef.current, {
            x: -width,
            duration: 30,
            repeat: -1,
            ease: 'none',
          });
        };

        setupMarquee();
        // restart on resize to correct width
        const ro = new ResizeObserver(() => setupMarquee());
        ro.observe(marqueeRef.current);
        return () => ro.disconnect();
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

  const campaigns = [
    {
      title: 'AI Healthcare Platform',
      raised: '$2.5M',
      backers: '12,450',
      category: 'Technology',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    },
    {
      title: 'Sustainable Energy Solution',
      raised: '$1.8M',
      backers: '8,200',
      category: 'Green Tech',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
    },
    {
      title: 'Smart Home Ecosystem',
      raised: '$3.2M',
      backers: '15,600',
      category: 'IoT',
      image:
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    },
    {
      title: 'EdTech Learning App',
      raised: '$1.5M',
      backers: '9,800',
      category: 'Education',
      image:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    },
    {
      title: 'Blockchain Finance',
      raised: '$4.1M',
      backers: '18,200',
      category: 'FinTech',
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
    },
  ];

  // Duplicate for seamless loop
  const allCampaigns = [...campaigns, ...campaigns];

  return (
    <section
      ref={sectionRef}
      className='relative h-full py-12 lg:py-16 bg-background text-foreground overflow-hidden flex flex-col justify-center'
    >
      {/* Reusable background cho nền tối */}
      <BlackHoleBackground
        isDark={isDarkMode}
        spacing={90}
        strength={1400}
        radius={300}
        lineWidth={1}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 mb-8'>
        {/* Title - Compact */}
        <div ref={titleRef}>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
            Dự án{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>
              đang hot
            </span>
          </h2>
        </div>
      </div>

      {/* Horizontal Scrolling Marquee - Smaller Cards */}
      <div className='relative overflow-hidden'>
        <div ref={marqueeRef} className='flex gap-6 px-4'>
          {allCampaigns.map((campaign, index) => (
            <div
              key={index}
              className='group relative flex-shrink-0 w-80 h-[400px] bg-card border border-border rounded-2xl overflow-hidden cursor-pointer'
            >
              {/* Image */}
              <div className='relative h-2/3 overflow-hidden'>
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-background to-transparent' />

                {/* Category Badge */}
                <div className='absolute top-4 left-4'>
                  <div className='px-3 py-1 bg-foreground/10 backdrop-blur-lg rounded-full text-xs font-semibold'>
                    {campaign.category}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <h3 className='text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors'>
                  {campaign.title}
                </h3>

                {/* Stats */}
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <div>
                    <div className='text-xl font-bold text-foreground mb-1'>
                      {campaign.raised}
                    </div>
                    <div>Raised</div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xl font-bold text-foreground mb-1'>
                      {campaign.backers}
                    </div>
                    <div>Backers</div>
                  </div>
                </div>
              </div>

              {/* Hover Border */}
              <div className='absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-2xl transition-colors pointer-events-none' />
            </div>
          ))}
        </div>
      </div>

      {/* View All CTA - Compact */}
      <div className='text-center mt-8'>
        <button className='group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold text-sm rounded-full hover:bg-primary hover:text-foreground transition-all duration-300'>
          Xem Tất Cả
          <svg
            className='w-4 h-4 transform group-hover:translate-x-1 transition-transform'
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
        </button>
      </div>
    </section>
  );
};

export default PopularCampaignsLanding;
