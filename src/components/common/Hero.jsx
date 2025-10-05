import React, { useState, useEffect } from 'react';
import Button from './Button';
import { mockCampaigns } from '../../data/mockCampaigns';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalSlides = mockCampaigns.length;

  // Tự động chuyển slide mỗi 3 giây
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
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
    const duration = 3000;

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

  // const handleMouseEnter = () => {
  //   setIsPaused(true);

  //   console.log("Ệt")
  // };

  // const handleMouseLeave = () => {
  //   setIsPaused(false);
  // };

  const handleSeeCampaign = () => {
    const campaign = mockCampaigns[currentSlide];
    console.log('Navigate to campaign:', campaign.id);
    // TODO: Implement navigation logic

    setIsPaused(false);
  };

  const handleSlideChange = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      setProgress(0);
      setIsPaused(false);
    }, 300);
  };

  return (
    <section
      className="relative min-h-[100vh] overflow-hidden"
      role="region"
      aria-label="Featured campaigns hero carousel"
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      {mockCampaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={campaign.heroImageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}

      {/* Overlay - Stronger gradient for mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 md:from-black/60 md:via-black/30 md:to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[100vh] items-end pb-24 sm:pb-28 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-container px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 lg:py-12">
          {/* Title with Animation */}
          <h1
            className={`text-2xl font-bold leading-tight text-text-white transition-all duration-300 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl max-w-4xl ${
              isAnimating ? 'hero-title-exit' : 'hero-title-enter'
            }`}
            aria-live="polite"
          >
            {mockCampaigns[currentSlide].title}
          </h1>

          {/* Description - Optional, only on larger screens */}
          <p className="hidden md:block mt-4 text-base lg:text-lg text-white/90 max-w-2xl">
            {mockCampaigns[currentSlide].description ||
              'Discover and support amazing campaigns'}
          </p>

          {/* Button */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSeeCampaign}
              className="shadow-lg hover:shadow-xl sm:text-base md:text-lg md:px-8 md:py-3"
            >
              See Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Responsive positioning */}
      <div className="absolute bottom-20 right-4 h-1 w-20 overflow-hidden rounded-full bg-white/30 sm:bottom-20 sm:w-24 md:bottom-6 md:h-1 md:w-32 lg:w-40">
        <div
          className="h-full bg-secondary origin-left transition-transform"
          style={{
            transform: `scaleX(${progress / 100})`,
          }}
        />
      </div>

      {/* Slide Indicators - Thumbnail Images - Responsive */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 px-4 sm:gap-2 md:gap-3 lg:gap-4">
        {mockCampaigns.map((campaign, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`group relative overflow-hidden rounded transition-all duration-300 ${
              index === currentSlide
                ? 'ring-2 ring-secondary ring-offset-1 ring-offset-black/50 scale-105 sm:scale-110'
                : 'opacity-50 hover:opacity-100 hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}: ${campaign.title}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            <img
              src={campaign.heroImageUrl}
              alt={campaign.title}
              className="h-10 w-14 object-cover sm:h-12 sm:w-16 md:h-14 md:w-20 lg:h-16 lg:w-24"
            />
            {/* Overlay when active */}
            {index === currentSlide && (
              <div className="absolute inset-0 bg-secondary/20" />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
