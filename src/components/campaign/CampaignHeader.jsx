import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Share2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Button from '@/components/common/Button';

// Helper function to check if URL is YouTube
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch {
    return null;
  }
  return null;
};

// VideoPlayer component with play button overlay (for server videos)
const VideoPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        controls={isPlaying}
        muted
        loop
        onPause={handlePause}
        onEnded={handlePause}
      />
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-200 group"
          aria-label="Play video"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary ml-1" fill="currentColor" />
          </div>
        </button>
      )}
    </div>
  );
};

// YouTube Embed component
const YouTubeEmbed = ({ videoId }) => {
  return (
    <div className="relative w-full h-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
      />
    </div>
  );
};

/**
 * Format currency with locale-specific formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'HKD', 'USD')
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';

  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Clamp percentage between 0 and 100 for display, but allow calculation > 100
 * @param {number} value - The percentage value
 * @returns {number} Clamped value for display
 */
const clampPercentForDisplay = (value) => {
  return Math.min(100, Math.max(0, Math.floor(value)));
};

/**
 * CampaignHeader Component
 * Displays the campaign hero section with image, details, and call-to-action buttons
 */
const CampaignHeader = ({
  campaign = {},
  onPickPerk = () => { },
  onSave = () => { },
  onShare = () => { },
  onTabChange = () => { },
  isPreview = false,
  isOwnerViewing = false,
}) => {
  const {
    title = 'Campaign Title',
    description = '',
    owner = null,
    introImageUrl = '/images/campaign-hero.jpg',
    introVideoUrl = null,
    currency = 'VND',
    pledgedAmount = 0,
    goalAmount = 0,
    backersCount = 0,
    daysLeft = 0,
  } = campaign;

  // State cho carousel
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Tạo array media từ image và video
  const mediaItems = [];

  // Luôn đảm bảo có ít nhất một image (placeholder nếu không có introImageUrl)
  if (introImageUrl) {
    mediaItems.push({ type: 'image', url: introImageUrl, isPlaceholder: false });
  } else {
    // Thêm placeholder image khi không có introImageUrl
    mediaItems.push({ type: 'placeholder', isPlaceholder: true });
  }

  if (introVideoUrl) {
    // Check if it's YouTube URL
    if (isYouTubeUrl(introVideoUrl)) {
      const videoId = getYouTubeVideoId(introVideoUrl);
      if (videoId) {
        mediaItems.push({ type: 'youtube', url: introVideoUrl, videoId });
      }
    } else {
      // Server video
      mediaItems.push({ type: 'video', url: introVideoUrl });
    }
  }

  const totalMedia = mediaItems.length;
  const hasMultipleMedia = totalMedia > 1;

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev === totalMedia - 1 ? 0 : prev + 1));
  };

  // Calculate progress percentage - Allow > 100% but clamp for width
  const actualProgressPercent = Math.floor((pledgedAmount / goalAmount) * 100);
  const progressPercentForWidth = clampPercentForDisplay(actualProgressPercent);

  // Format numbers
  const formattedPledged = formatCurrency(pledgedAmount, currency);
  const formattedGoal = formatCurrency(goalAmount, currency);

  return (
    <div className="relative overflow-hidden bg-[#0a1628]">
      {/* Animated Background with Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated dots/stars pattern */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                            radial-gradient(2px 2px at 60% 70%, white, transparent),
                            radial-gradient(1px 1px at 50% 50%, white, transparent),
                            radial-gradient(1px 1px at 80% 10%, white, transparent),
                            radial-gradient(2px 2px at 90% 60%, white, transparent),
                            radial-gradient(1px 1px at 33% 50%, white, transparent),
                            radial-gradient(1px 1px at 70% 40%, white, transparent)`,
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 0%',
            opacity: 0.4,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />

        {/* Primary gradient orb - Blue */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(8,148,226,0.3) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
          animate={{
            x: ['-20%', '10%', '-20%'],
            y: ['-20%', '10%', '-20%'],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ x: '-20%', y: '-20%' }}
        />

        {/* Accent gradient orb - Yellow */}
        <motion.div
          className="absolute top-0 w-full h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(252,230,90,0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: ['20%', '-10%', '20%'],
            y: ['20%', '-10%', '20%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ x: '20%', y: '20%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-6 py-12 lg:pt-16 lg:pb-20">
        {/* Title & Description Section */}
        <div className="flex justify-center">
          <div className="max-w-4xl">
            <motion.h1
              className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-4 leading-tight"
              style={{ fontFamily: "'Roboto Slab', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="text-base mb-12 lg:mb-8 lg:text-md text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {description}
            </motion.p>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Campaign Media (60%) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative aspect-video rounded-sm border-2 border-white/10 shadow-2xl">
              {/* Media Display */}
              {mediaItems.length > 0 && mediaItems[currentMediaIndex] && (
                <>
                  {mediaItems[currentMediaIndex].type === 'image' ? (
                    <img
                      src={mediaItems[currentMediaIndex].url}
                      alt={`Hình ảnh chiến dịch cho ${title}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                      onError={(e) => {
                        // Fallback to gradient placeholder if image fails to load
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('.placeholder-gradient')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'placeholder-gradient absolute inset-0 bg-gradient-to-br from-[#0894e2]/20 via-[#0a1628] to-[#fce65a]/10 flex items-center justify-center';
                          placeholder.innerHTML = `
                            <div class="text-center text-white/50">
                              <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p class="text-sm">Không có hình ảnh</p>
                            </div>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : mediaItems[currentMediaIndex].type === 'placeholder' ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0894e2]/20 via-[#0a1628] to-[#fce65a]/10 flex items-center justify-center">
                      <div className="text-center text-white/50">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Không có hình ảnh</p>
                      </div>
                    </div>
                  ) : mediaItems[currentMediaIndex].type === 'youtube' ? (
                    <YouTubeEmbed videoId={mediaItems[currentMediaIndex].videoId} />
                  ) : (
                    <VideoPlayer url={mediaItems[currentMediaIndex].url} />
                  )}
                </>
              )}

              {/* Navigation Arrows - Only show if multiple media */}
              {hasMultipleMedia && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevMedia}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center text-black transition-all duration-200 backdrop-blur-sm"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextMedia}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center text-black transition-all duration-200 backdrop-blur-sm"
                    aria-label="Next media"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Media Indicators */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {mediaItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${index === currentMediaIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/70'
                          }`}
                        aria-label={`Go to media ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Creator Information */}
            {/* <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 rounded-full bg-primary p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {creator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <a
                  href={creator.link}
                  className="text-white font-semibold text-lg hover:text-[#0894e2] transition-colors block"
                >
                  {creator.name}
                </a>
                <p className="text-sm text-gray-400">
                  {creator.location}
                </p>
              </div>
            </div> */}
          </motion.div>

          {/* Right Column - Campaign Stats (40%) */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="space-y-8">
              {/* Funding Stats */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fce65a] rounded-full" />
                <div className="pl-6">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {formattedPledged} {currency}
                  </div>
                  <div className="text-sm text-gray-300">
                    đã gây quỹ trên mục tiêu {formattedGoal} {currency}
                  </div>
                </div>
              </div>

              {/* Linear Progress Bar & Stats */}
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">
                      {actualProgressPercent}%
                    </span>
                    <span className="text-sm text-gray-300">đạt được</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0894e2] to-[#0894e2] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentForWidth}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {backersCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">
                      Người ủng hộ
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {daysLeft}
                    </div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">
                      Ngày còn lại
                    </div>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="space-y-4">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full text-base font-bold shadow-lg shadow-[#0894e2]/30 focus:outline-none focus-visible:ring-0"
                  onClick={() => {
                    onTabChange('rewards');
                    onPickPerk();
                  }}
                  disabled={isPreview || isOwnerViewing}
                >
                  ỦNG HỘ DỰ ÁN NÀY
                </Button>

                {/* <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onSave}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-white/10 hover:border-[#fce65a]/50 flex items-center justify-center gap-2"
                    aria-label="Nhắc tôi"
                  >
                    <Bell size={16} />
                    <span>NHẮC TÔI</span>
                  </button>
                  <button
                    onClick={onShare}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-white/10 hover:border-[#fce65a]/50 flex items-center justify-center gap-2"
                    aria-label="Chia sẻ chiến dịch"
                  >
                    <Share2 size={16} />
                    <span>CHIA SẺ</span>
                  </button>
                </div> */}
              </div>

              {/* Additional Info */}
              <div className="pt-3">
                <p className="text-xs text-center text-gray-300 leading-relaxed">
                  <span className="text-[#fce65a] font-semibold">Tất cả hoặc không gì cả.</span> Dự án chỉ được gây quỹ nếu đạt mục tiêu trước thời hạn.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHeader;
