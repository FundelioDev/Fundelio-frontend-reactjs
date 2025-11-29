import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { campaignApi } from '@/api/campaignApi';

const Hero = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Refs for GSAP animations
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const overlayRef = useRef(null);
  const hasAnimatedCTA = useRef(false);

  const totalSlides = campaigns.length;

  // Fetch top campaigns from API
  useEffect(() => {
    const fetchHeroCampaigns = async () => {
      try {
        setLoading(true);
        // Spring Filter: ACTIVE and SUCCESSFUL campaigns, sorted by pledgedAmount
        const response = await campaignApi.getAllCampaigns({
          filter: "campaignStatus in ['ACTIVE','SUCCESSFUL']",
          sort: ['backersCount,desc', 'pledgedAmount,desc'],
          size: 7,
          page: 1,
        });

        if (response?.data?.data?.content && response.data.data.content.length > 0) {
          const campaigns = response.data.data.content;
          setCampaigns(campaigns);

          // Preload first hero image for better LCP
          if (campaigns[0]?.introImageUrl) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = campaigns[0].introImageUrl;
            link.fetchpriority = 'high';
            document.head.appendChild(link);
          }
        }
      } catch (error) {
        console.error('Error fetching hero campaigns:', error);
        // Fallback to empty array on error
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroCampaigns();
  }, []);

  // Initial CTA animation - only runs once on mount
  useEffect(() => {
    if (!hasAnimatedCTA.current && ctaRef.current) {
      hasAnimatedCTA.current = true;

      gsap.fromTo(
        ctaRef.current,
        {
          scale: 0,
          opacity: 0,
          rotationY: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          delay: 0.8,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, []);

  // Title and description animation on slide change
  useEffect(() => {
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
          rotationX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      );
    }

    if (overlayRef.current) {
      tl.fromTo(
        overlayRef.current,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0
      );
    }

    return () => {
      tl.kill();
    };
  }, [currentSlide]);

  // Tự động chuyển slide mỗi 3 giây
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => {
          const next = (prev + 1) % totalSlides;
          return Math.max(0, Math.min(next, totalSlides - 1));
        });
        setIsAnimating(false);
        setProgress(0);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    const startTime = Date.now();
    const duration = 2900;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentSlide, isPaused]);


  const handleSeeCampaign = () => {
    if (campaigns.length === 0) return;

    const safeCurrentSlide = Math.max(0, Math.min(currentSlide, campaigns.length - 1));
    const campaign = campaigns[safeCurrentSlide];
    if (!campaign || !campaign.campaignId) return;

    // Navigate to campaign detail page
    navigate(`/campaigns/${campaign.campaignId}`);

    // Animate button on click
    gsap.to(ctaRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    setIsPaused(false);
  };

  const handleSlideChange = (index) => {
    if (campaigns.length === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      setProgress(0);
      setIsPaused(false);
    }, 300);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative min-h-[100vh] overflow-hidden w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải chiến dịch nổi bật...</p>
        </div>
      </section>
    );
  }

  // Empty state if no campaigns
  if (campaigns.length === 0) {
    return (
      <section className="relative min-h-[100vh] overflow-hidden w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-white text-xl">Chưa có chiến dịch nổi bật</p>
        </div>
      </section>
    );
  }

  // Ensure currentSlide is within bounds
  const safeCurrentSlide = Math.max(0, Math.min(currentSlide, campaigns.length - 1));
  const currentCampaign = campaigns[safeCurrentSlide];

  // Safety check: if current campaign doesn't exist, show empty state
  if (!currentCampaign) {
    return (
      <section className="relative min-h-[100vh] overflow-hidden w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-white text-xl">Đang tải chiến dịch...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full md:block pt-[60px] md:pt-0 md:min-h-screen"
      role="region"
      aria-label="Featured campaigns hero carousel"
    // onMouseEnter={handleMouseEnter}
    // onMouseLeave={handleMouseLeave}
    >
      {/* Mobile Image Container with Overlay Content - 5:6 Aspect Ratio (~400x480) */}
      <div className="md:hidden relative w-full aspect-[5/6] overflow-hidden">
        {campaigns.map((campaign, index) => (
          campaign && (
            <div
              key={`mobile-img-${campaign.campaignId || index}`}
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${index === safeCurrentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={campaign.introImageUrl || 'https://via.placeholder.com/1920x1080?text=Campaign'}
                alt={campaign.title || 'Campaign'}
                className="h-full w-full object-cover object-center"
                loading={index === safeCurrentSlide ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )
        ))}
        {/* Mobile Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Mobile Content - Overlaid on Image */}
        <div className="absolute inset-0 flex items-end pb-24">
          <div className="w-full px-4">
            {/* Decorative line */}
            <div className="mb-3 flex items-center gap-1.5">
              <div className="h-[2px] w-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                Featured Campaign
              </span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-xl font-black leading-tight text-white mb-3 line-clamp-2"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
              }}
            >
              {currentCampaign.title || 'Untitled Campaign'}
            </h1>

            {/* Backer Count - Mobile */}
            <div className="mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-xs font-medium text-white/90">
                {currentCampaign.backersCount?.toLocaleString('vi-VN') || 0} người ủng hộ
              </span>
            </div>

            {/* Button */}
            <div ref={ctaRef}>
              <Button
                size="sm"
                onClick={handleSeeCampaign}
                className="group relative overflow-hidden uppercase shadow-2xl hover:shadow-cyan-500/50 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 text-white border-0 transition-all duration-500 font-bold tracking-wider rounded-full"
              >
                <span className="relative z-10 flex items-center gap-2">
                  XEM CHIẾN DỊCH
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Background Images - Absolute Full Screen */}
      <div className="hidden md:block absolute inset-0 h-full w-full">
        {campaigns.map((campaign, index) => (
          campaign && (
            <div
              key={`desktop-img-${campaign.campaignId || index}`}
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${index === safeCurrentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={campaign.introImageUrl || 'https://via.placeholder.com/1920x1080?text=Campaign'}
                alt={campaign.title || 'Campaign'}
                className="h-full w-full object-cover object-center"
                loading={index === safeCurrentSlide ? 'eager' : 'lazy'}
                fetchpriority={index === safeCurrentSlide ? 'high' : undefined}
                decoding="async"
              />
            </div>
          )
        ))}
        {/* Desktop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 via-50% to-black/60" />
      </div>

      {/* Animated overlay accent */}
      {/* <div
        ref={overlayRef}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      /> */}

      {/* Desktop Content */}
      <div className="hidden md:flex relative z-10 h-full min-h-screen items-center">
        <div className="mx-auto w-full max-w-container px-4 py-8 md:px-8 lg:px-12">

          {/* Decorative line above title */}
          <div className="mb-4 flex items-center gap-1.5">
            <div className="h-[2px] w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">
              Featured Campaign
            </span>
          </div>

          {/* Title with Animation and improved typography */}
          <div className="perspective-1000 mb-6">
            <h1
              ref={titleRef}
              className="text-xl font-black leading-tight text-white transition-all duration-300 sm:text-3xl max-w-5xl drop-shadow-2xl"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
                letterSpacing: '-0.02em',
              }}
              aria-live="polite"
            >
              {currentCampaign.title || 'Untitled Campaign'}
            </h1>
          </div>

          {/* Description - Enhanced styling */}
          <div className="perspective-1000">
            <p
              ref={descriptionRef}
              className="hidden md:block text-base lg:text-lg line-clamp-3 text-white/95 max-w-2xl leading-relaxed font-light"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}
            >
              {currentCampaign.description ||
                'Discover and support amazing campaigns that make a difference'}
            </p>
          </div>

          {/* Backer Count - Desktop */}
          <div className="mt-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium text-white/90">
              {currentCampaign.backersCount?.toLocaleString('vi-VN') || 0} người ủng hộ
            </span>
          </div>

          {/* Button with enhanced styling */}
          <div className="mt-6 sm:mt-8 md:mt-10">
            <div ref={ctaRef} className="inline-block">
              <Button
                size="md"
                onClick={handleSeeCampaign}
                className="group relative overflow-hidden uppercase shadow-2xl hover:shadow-cyan-500/50 sm:text-lg md:text-xl md:px-8 md:py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 text-white border-0 transition-all duration-500 font-bold tracking-wider rounded-full"
              >
                <span className="relative z-10 flex items-center gap-2">
                  XEM CHIẾN DỊCH
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-cyan-400/50 -z-10" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Enhanced design */}
      <div className="absolute bottom-24 right-4 sm:bottom-24 sm:right-6 md:bottom-8 md:right-8 lg:right-12">
        <div className="flex flex-col items-end gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm border border-white/10 sm:w-28 md:w-36 lg:w-48">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 origin-left transition-transform shadow-lg shadow-cyan-500/50"
              style={{
                transform: `scaleX(${progress / 100})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Slide Indicators - Thumbnail Images - Enhanced design */}
      <div className="absolute bottom-4 left-4 lg:left-18 px-2 z-20 flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 py-4 max-w-[calc(100vw-2rem)] overflow-x-auto scrollbar-hide">
        {(() => {
          const maxVisible = 7;
          const halfVisible = Math.floor(maxVisible / 2);

          // Calculate the range of visible slides
          let startIndex = Math.max(0, currentSlide - halfVisible);
          let endIndex = Math.min(totalSlides, startIndex + maxVisible);

          // Adjust start if we're near the end
          if (endIndex - startIndex < maxVisible) {
            startIndex = Math.max(0, endIndex - maxVisible);
          }

          const visibleSlides = campaigns.slice(startIndex, endIndex);

          return visibleSlides.map((campaign, idx) => {
            if (!campaign) return null;
            const actualIndex = startIndex + idx;
            return (
              <button
                key={campaign.campaignId || actualIndex}
                onClick={() => handleSlideChange(actualIndex)}
                className={`group relative overflow-hidden rounded-sm transition-all duration-300 border-2 flex-shrink-0 ${actualIndex === safeCurrentSlide
                  ? "border-primary shadow-lg shadow-primary/50 scale-103 sm:scale-105"
                  : "border-white/20 opacity-60 hover:opacity-100 hover:scale-105 hover:border-white/40"
                  }`}
                aria-label={`Go to slide ${actualIndex + 1}: ${campaign.title || 'Campaign'}`}
                aria-current={actualIndex === safeCurrentSlide ? "true" : "false"}
              >
                <img
                  src={campaign.introImageUrl || "/placeholder.svg?height=96&width=128&query=campaign-thumbnail"}
                  alt={campaign.title || 'Campaign'}
                  className="h-11 w-16 object-cover sm:h-12 sm:w-20 transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                {/* Gradient overlay when active */}
                {actualIndex === safeCurrentSlide && (
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/50 via-blue-500/30 to-transparent" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 transition-all duration-200 group-hover:from-black/30 group-hover:via-black/10" />

                {/* Active indicator dot */}
                {actualIndex === safeCurrentSlide && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div>
                )}
              </button>
            );
          });
        })()}
      </div>
    </section>
  );
};

export default Hero;
