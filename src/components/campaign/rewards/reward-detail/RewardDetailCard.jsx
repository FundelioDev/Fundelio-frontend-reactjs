import { motion } from 'framer-motion';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { RewardDetailModal } from './RewardDetailModal';

export function RewardDetailCard({ reward, items = [], addOns = [], onSelectReward, showChooseButton = false, campaignId, isPreview = false, isOwnerViewing = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if sold out
  const isSoldOut = reward.rewardStatus === 'SOLD_OUT';

  // Format delivery date
  const eta = reward.estimated_delivery
    ? new Date(reward.estimated_delivery).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    : 'Chưa xác định';

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Get original price if discounted
  const hasDiscount = reward.original_price && reward.original_price > reward.min_pledge_amount;
  const isInteractionLocked = isPreview || isOwnerViewing;
  const lockedLabel = isPreview
    ? 'Chỉ xem trước'
    : isOwnerViewing
      ? 'Tác giả không thể tự ủng hộ'
      : '';

  return (
    <>
      <Card className={`overflow-hidden rounded-lg border border-border/50 hover:shadow-lg transition-shadow bg-white dark:bg-darker-2 w-full ${isSoldOut ? 'opacity-60 grayscale' : ''}`}>
        {/* Grid Layout - Image Left, Content Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-0 w-full">
          {/* Left - Image Section */}
          <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-darker aspect-square md:aspect-square min-h-[300px] md:min-h-0">
              <img
                src={reward.imageUrl || reward.image}
                alt={reward.imageAlt || reward.title}
                className="w-full h-full object-cover"
              />

              {/* SOLD OUT Overlay */}
              {isSoldOut && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="bg-red-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-sm font-bold text-lg md:text-2xl shadow-lg transform -rotate-12 whitespace-nowrap">
                    ĐÃ HẾT
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {reward.featured && !isSoldOut && (
              <div className="absolute top-2 md:top-3 left-2 md:left-3 z-10">
                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-primary text-white text-[10px] md:text-xs font-bold rounded-sm">
                    NỔI BẬT
                  </span>
                </div>
              )}
          </div>

          {/* Right - Content Section */}
          <div className="flex flex-col justify-between bg-white dark:bg-darker-2 min-h-0 w-full">
            <div className="p-5 md:p-7 flex-shrink-0 w-full">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight break-words"
                style={{ fontFamily: "'Roboto Slab', serif" }}>
                {reward.title}
              </h3>

              {/* Price Section */}
              <div className="mb-4">
                <span className="text-lg md:text-[22px] font-bold text-primary">
                  {formatPrice(reward.minPledgedAmount)} <span className="text-sm md:text-base">VND</span>
                </span>
              </div>

              {/* Perks info if available */}
              {reward.perk_name && (
                <p className="text-sm md:text-base text-foreground font-semibold mb-4 break-words">
                  {reward.perkName}
                </p>
              )}

              {/* More info link */}
              <div onClick={() => setIsModalOpen(true)} className="text-primary text-xs md:text-sm font-semibold hover:underline mb-6 inline-flex items-center gap-1 cursor-pointer">
                Xem thêm <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="font-semibold text-foreground truncate">{reward.backers || 0} lượt ủng hộ</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{reward.shipsTo}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-auto flex-shrink-0 w-full">
              {showChooseButton ? (
                <div className="space-y-3 p-5 md:p-7 pt-0 w-full">
                  <Button
                    className="w-full font-bold text-white bg-primary hover:bg-primary/90 shadow-lg h-12 md:h-14 text-xs md:text-sm lg:text-base px-2 md:px-4 whitespace-normal break-words"
                    onClick={() => !isSoldOut && !isInteractionLocked && setIsModalOpen(true)}
                    disabled={isSoldOut || isInteractionLocked}
                  >
                    <span className="break-words">{isSoldOut ? 'ĐÃ HẾT - KHÔNG KHẢ DỤNG' : isInteractionLocked ? lockedLabel : 'CHỌN GÓI NÀY'}</span>
                  </Button>
                  {!isSoldOut && (
                    <>
                      <div className="text-center text-xs md:text-sm font-semibold text-muted-foreground">HOẶC</div>
                      <Button
                        variant="outline"
                        className="w-full font-bold h-12 md:h-14 text-xs md:text-sm lg:text-base border-2 border-primary text-primary hover:bg-primary/10 px-2 md:px-4 whitespace-normal break-words"
                        onClick={() => !isInteractionLocked && setIsModalOpen(true)}
                        disabled={isInteractionLocked}
                      >
                        <span className="break-words">{isInteractionLocked ? lockedLabel : '+ CHỌN GÓI KHÁC'}</span>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full font-bold text-white bg-primary hover:bg-primary/90 shadow-lg rounded-none md:rounded-b-r-lg h-11 text-xs md:text-sm lg:text-base px-2 md:px-4 whitespace-normal break-words"
                  onClick={() => !isSoldOut && !isInteractionLocked && setIsModalOpen(true)}
                  disabled={isSoldOut || isInteractionLocked}
                >
                  <span className="break-words">{isSoldOut ? 'ĐÃ HẾT' : isInteractionLocked ? lockedLabel : 'THÊM VÀO GIỎ'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal */}
      <RewardDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reward={reward}
        items={items}
        addOns={addOns}
        onSelectReward={onSelectReward}
        campaignId={campaignId}
        isPreview={isPreview}
        isOwnerViewing={isOwnerViewing}
      />
    </>
  );
}
