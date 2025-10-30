import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import HeroLanding from '@/components/landing-page/HeroLanding';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import HowItWorksSection from '@/components/landing-page/HowItWorksSection';
import StatisticsSection from '@/components/landing-page/StatisticsSection';
import PopularCampaignsLanding from '@/components/landing-page/PopularCampaignsLanding';
import CTASection from '@/components/landing-page/CTASection';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const morphOverlayRef = useRef(null);
  const isScrollingRef = useRef(false); // Dùng ref thay vì local variable
  const previousSectionRef = useRef(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(true);

  const sections = [
    { id: 'hero', component: HeroLanding, color: '#000000' },
    { id: 'features', component: FeaturesSection, color: '#0894E2' },
    { id: 'how-it-works', component: HowItWorksSection, color: '#FFB700' },
    { id: 'statistics', component: StatisticsSection, color: '#0894E2' },
    { id: 'campaigns', component: PopularCampaignsLanding, color: '#000000' },
    { id: 'cta', component: CTASection, color: '#FFB700' },
  ];

  useEffect(() => {
    const handleWheel = (e) => {
      // Ignore scroll nếu đang trong quá trình transition
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // Chỉ nhận scroll khi deltaY đủ lớn (tránh scroll vô tình)
      const threshold = 10;
      if (Math.abs(e.deltaY) < threshold) {
        return;
      }

      // Nếu đã ở section cuối và scroll xuống, unlock scroll để vào footer
      if (currentSection === sections.length - 1 && e.deltaY > 0) {
        setIsScrollLocked(false);
        return;
      }

      // Nếu đang ở footer và scroll lên, lock lại và về section cuối
      if (
        !isScrollLocked &&
        e.deltaY < 0 &&
        window.scrollY <= window.innerHeight * sections.length
      ) {
        e.preventDefault();
        setIsScrollLocked(true);
        setCurrentSection(sections.length - 1);
        return;
      }

      if (isScrollLocked) {
        e.preventDefault();
        isScrollingRef.current = true;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
          // Scroll xuống
          setCurrentSection((prev) => prev + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          // Scroll lên
          setCurrentSection((prev) => prev - 1);
        } else {
          // Nếu không thể scroll (đang ở đầu/cuối), reset flag ngay
          isScrollingRef.current = false;
          return;
        }

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200); // Tăng debounce time lên 1.2s
      }
    };

    const handleKeyDown = (e) => {
      if (isScrollingRef.current || !isScrollLocked) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
          isScrollingRef.current = true;
          setCurrentSection((prev) => prev + 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1200);
        } else {
          setIsScrollLocked(false);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection > 0) {
          isScrollingRef.current = true;
          setCurrentSection((prev) => prev - 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1200);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        isScrollingRef.current = true;
        setCurrentSection(0);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);
      } else if (e.key === 'End') {
        e.preventDefault();
        isScrollingRef.current = true;
        setCurrentSection(sections.length - 1);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrollLocked, sections.length]);

  useEffect(() => {
    if (isScrollLocked && sectionsRef.current[currentSection]) {
      // Determine scroll direction
      const isScrollingDown = currentSection > previousSectionRef.current;

      // Get colors for gradient
      const currentColor = sections[currentSection]?.color || '#667eea';
      const previousColor =
        sections[previousSectionRef.current]?.color || '#764ba2';

      // Random transition type with enhanced effects (removed 'glitch' to avoid flashing)
      const transitions = [
        'softFade',
        'liquidMorph',
        'particles',
        'hexagon',
        'ripple',
      ];
      const randomTransition =
        transitions[Math.floor(Math.random() * transitions.length)];

      // Morph transition effect
      const tl = gsap.timeline();

      // Set gradient
      gsap.set(morphOverlayRef.current, {
        background: `linear-gradient(135deg, ${previousColor} 0%, ${currentColor} 100%)`,
      });

      // Apply transition based on type
      switch (randomTransition) {
        case 'softFade': {
          // Soft cross-fade overlay with gentle container move
          tl.fromTo(
            morphOverlayRef.current,
            { opacity: 0, clipPath: 'inset(0 0 0 0)', filter: 'blur(8px)' },
            {
              opacity: 0.35,
              filter: 'blur(0px)',
              duration: 0.3,
              ease: 'power1.out',
            }
          );

          // Switch content smoothly
          tl.to(
            containerRef.current,
            {
              y: -currentSection * window.innerHeight,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.2'
          );

          // Fade overlay out
          tl.to(morphOverlayRef.current, {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          });
          break;
        }
        case 'liquidMorph': {
          // Liquid morphing effect
          const startPath = isScrollingDown
            ? 'M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z'
            : 'M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z';
          const midPath1 = isScrollingDown
            ? 'M 0 80 Q 50 20 100 80 L 100 100 L 0 100 Z'
            : 'M 0 20 Q 50 80 100 20 L 100 0 L 0 0 Z';
          const midPath2 = isScrollingDown
            ? 'M 0 40 Q 50 60 100 40 L 100 100 L 0 100 Z'
            : 'M 0 60 Q 50 40 100 60 L 100 0 L 0 0 Z';
          const fullPath = 'M 0 0 L 100 0 L 100 100 L 0 100 Z';

          // Wave in with liquid effect
          tl.fromTo(
            morphOverlayRef.current,
            { clipPath: startPath, opacity: 0.6 },
            { clipPath: midPath1, duration: 0.3, ease: 'power2.in' }
          );
          tl.to(morphOverlayRef.current, {
            clipPath: midPath2,
            duration: 0.25,
            ease: 'power1.inOut',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: fullPath,
            duration: 0.35,
            ease: 'power2.out',
          });

          // Switch content
          tl.to(
            containerRef.current,
            {
              y: -currentSection * window.innerHeight,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.4'
          );

          // Wave out with reverse liquid effect
          const endPath = isScrollingDown
            ? 'M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z'
            : 'M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z';
          tl.to(morphOverlayRef.current, {
            clipPath: midPath2,
            duration: 0.25,
            ease: 'power1.in',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: midPath1,
            duration: 0.25,
            ease: 'power1.inOut',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: endPath,
            duration: 0.3,
            ease: 'power2.out',
          });
          break;
        }

        case 'particles': {
          // Exploding particles effect with multiple circles
          const centerX = 50;
          const centerY = 50;

          // Multiple expanding circles
          tl.fromTo(
            morphOverlayRef.current,
            {
              clipPath: `circle(0% at ${centerX}% ${centerY}%)`,
              opacity: 0.6,
              filter: 'blur(0px)',
            },
            {
              clipPath: `circle(70% at ${centerX}% ${centerY}%)`,
              filter: 'blur(2px)',
              duration: 0.4,
              ease: 'power2.in',
            }
          );

          tl.to(morphOverlayRef.current, {
            clipPath: `circle(150% at ${centerX}% ${centerY}%)`,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power3.out',
          });

          // Switch content
          tl.to(
            containerRef.current,
            {
              y: -currentSection * window.innerHeight,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.4'
          );

          // Contract back
          tl.to(morphOverlayRef.current, {
            clipPath: `circle(70% at ${centerX}% ${centerY}%)`,
            filter: 'blur(2px)',
            duration: 0.4,
            ease: 'power2.in',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: `circle(0% at ${centerX}% ${centerY}%)`,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power3.out',
          });

          tl.set(morphOverlayRef.current, { filter: 'blur(0px)' });
          break;
        }

        case 'hexagon': {
          // Hexagonal expanding pattern
          const hexStart = isScrollingDown
            ? 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)'
            : 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)';
          const hexMid =
            'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)';
          const hexFull =
            'polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)';

          // Expand hexagon
          tl.fromTo(
            morphOverlayRef.current,
            {
              clipPath: hexStart,
              opacity: 0.7,
              rotation: 0,
            },
            {
              clipPath: hexMid,
              rotation: 60,
              duration: 0.5,
              ease: 'power2.inOut',
            }
          );
          tl.to(morphOverlayRef.current, {
            clipPath: hexFull,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out',
          });

          // Switch content
          tl.to(
            containerRef.current,
            {
              y: -currentSection * window.innerHeight,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.4'
          );

          // Contract hexagon
          const hexEnd = isScrollingDown
            ? 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)'
            : 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)';

          tl.to(morphOverlayRef.current, {
            clipPath: hexMid,
            rotation: -60,
            duration: 0.4,
            ease: 'power2.in',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: hexEnd,
            rotation: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          });

          tl.set(morphOverlayRef.current, { rotation: 0 });
          break;
        }

        case 'ripple': {
          // Ripple wave effect with multiple layers
          const centerY = isScrollingDown ? 100 : 0;

          // First ripple
          tl.fromTo(
            morphOverlayRef.current,
            {
              clipPath: `ellipse(0% 0% at 50% ${centerY}%)`,
              opacity: 0.6,
            },
            {
              clipPath: `ellipse(50% 30% at 50% ${centerY}%)`,
              duration: 0.3,
              ease: 'power1.out',
            }
          );

          // Second ripple (bigger)
          tl.to(morphOverlayRef.current, {
            clipPath: `ellipse(80% 60% at 50% ${centerY}%)`,
            opacity: 0.7,
            duration: 0.35,
            ease: 'power2.out',
          });

          // Full coverage
          tl.to(morphOverlayRef.current, {
            clipPath: `ellipse(150% 150% at 50% ${centerY}%)`,
            duration: 0.35,
            ease: 'power2.out',
          });

          // Switch content
          tl.to(
            containerRef.current,
            {
              y: -currentSection * window.innerHeight,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.35'
          );

          // Ripple out
          const endY = isScrollingDown ? 0 : 100;
          tl.to(morphOverlayRef.current, {
            clipPath: `ellipse(80% 60% at 50% ${endY}%)`,
            duration: 0.3,
            ease: 'power1.in',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: `ellipse(50% 30% at 50% ${endY}%)`,
            opacity: 0.6,
            duration: 0.3,
            ease: 'power1.in',
          });
          tl.to(morphOverlayRef.current, {
            clipPath: `ellipse(0% 0% at 50% ${endY}%)`,
            opacity: 0.6,
            duration: 0.3,
            ease: 'power2.in',
          });
          break;
        }

        default:
          break;
      }

      // Animate sections opacity (smoother cross-fade and scale)
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          if (index === currentSection) {
            tl.to(
              section,
              {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
              },
              '-=0.35'
            );
          } else {
            tl.to(
              section,
              {
                opacity: 0,
                scale: 0.98,
                duration: 0.35,
                ease: 'power2.inOut',
              },
              '-=0.35'
            );
          }
        }
      });

      // Reset at the end
      tl.set(morphOverlayRef.current, { opacity: 0 });

      // Update previous section
      previousSectionRef.current = currentSection;
    }
  }, [currentSection, isScrollLocked, sections]);

  return (
    <div className='relative bg-background'>
      <Header variant='light' />

      {/* Fullpage Sections Container */}
      <div className='relative h-screen overflow-hidden'>
        {/* Morph Transition Overlay with Enhanced Effects */}
        <div
          ref={morphOverlayRef}
          className='fixed inset-0 z-40 pointer-events-none backdrop-blur-md flex items-center justify-center morph-overlay'
          style={{
            background: 'linear-gradient(135deg, #0894E2 0%, #FFB700 100%)',
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0,
            mixBlendMode: 'normal',
            transformOrigin: 'center center',
          }}
        >
          {/* Animated Gradient Overlay */}
          <div className='absolute inset-0 animate-gradient-shift opacity-60' />

          {/* Noise Texture Overlay */}
          <div
            className='absolute inset-0 opacity-20 animate-noise-shift'
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
              backgroundSize: '200px 200px',
            }}
          />

          {/* Shimmer Effect */}
          <div
            className='absolute inset-0 shimmer-effect'
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
            }}
          />
        </div>

        <div ref={containerRef} className='will-change-transform'>
          {sections.map((section, index) => {
            const SectionComponent = section.component;
            return (
              <div
                key={section.id}
                ref={(el) => (sectionsRef.current[index] = el)}
                className='h-screen w-full'
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                <SectionComponent />
              </div>
            );
          })}
        </div>

        {/* Section Indicators */}
        <div className='fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3'>
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                if (isScrollLocked) {
                  setCurrentSection(index);
                }
              }}
              className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-foreground scale-125'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Go to ${section.id}`}
            >
              {/* Tooltip */}
              <span className='absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-card text-foreground border border-border text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm'>
                {section.id}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll Hint */}
        {currentSection < sections.length - 1 && (
          <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-foreground/60 text-sm animate-bounce'>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-xs tracking-wider'>SCROLL</span>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Only accessible after viewing all sections */}
      {!isScrollLocked && (
        <div className='relative'>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
