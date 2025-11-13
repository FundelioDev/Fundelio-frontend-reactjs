import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';

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
 * Clamp percentage between 0 and 100
 * @param {number} value - The percentage value
 * @returns {number} Clamped value
 */
const clampPercent = (value) => {
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
}) => {
  const {
    title = 'Campaign Title',
    highlights = [],
    creator = { name: 'Creator Name', location: 'Location', link: '#' },
    introImageUrl = '/images/campaign-hero.jpg',
    introVideoUrl = null,
    currency = 'HKD',
    pledged = 0,
    goal = 1,
    backers = 0,
    daysLeft = 0,
  } = campaign;

  // State cho carousel
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Tạo array media từ image và video
  const mediaItems = [];
  if (introImageUrl) {
    mediaItems.push({ type: 'image', url: introImageUrl });
  }
  if (introVideoUrl) {
    mediaItems.push({ type: 'video', url: introVideoUrl });
  }

  const totalMedia = mediaItems.length;
  const hasMultipleMedia = totalMedia > 1;

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev === totalMedia - 1 ? 0 : prev + 1));
  };

  // Calculate progress percentage
  const progressPercent = clampPercent((pledged / goal) * 100);

  // Format numbers
  const formattedPledged = formatCurrency(pledged, currency);
  const formattedGoal = formatCurrency(goal, currency);

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
        {/* <motion.div
          className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full"
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
        /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-6 py-12 lg:py-14">
        {/* Title & Description Section */}
        <div className="mb-12 lg:mb-16 flex justify-center">
          <div className="max-w-4xl">
            <motion.h1
              className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Roboto Slab', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-base lg:text-lg text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {highlights}
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
            <div className="relative aspect-video overflow-hidden rounded-sm border-2 border-white/10 shadow-2xl">
              {/* Media Display */}
              {mediaItems.length > 0 && mediaItems[currentMediaIndex] && (
                <>
                  {mediaItems[currentMediaIndex].type === 'image' ? (
                    <img
                      src={mediaItems[currentMediaIndex].url}
                      alt={`Hình ảnh chiến dịch cho ${title}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <video
                      src={mediaItems[currentMediaIndex].url}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  )}
                </>
              )}

              {/* Navigation Arrows - Only show if multiple media */}
              {hasMultipleMedia && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    aria-label="Next media"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Media Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {mediaItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentMediaIndex
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
                    {currency} {formattedPledged}
                  </div>
                  <div className="text-sm text-gray-300">
                    đã gây quỹ trên mục tiêu {currency} {formattedGoal}
                  </div>
                </div>
              </div>

              {/* Linear Progress Bar & Stats */}
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">
                      {progressPercent}%
                    </span>
                    <span className="text-sm text-gray-300">đạt được</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0894e2] to-[#0894e2] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {backers.toLocaleString()}
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
                  className="w-full text-base font-bold shadow-lg shadow-[#0894e2]/30"
                  onClick={onPickPerk}
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
