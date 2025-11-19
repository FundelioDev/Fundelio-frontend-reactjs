import { motion } from 'framer-motion';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { RewardDetailModal } from './RewardDetailModal';

export function RewardDetailCard({ reward, items = [], addOns = [], onSelectReward, showChooseButton = false, campaignId }) {
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

  return (
    <>
      <Card className={`overflow-hidden rounded-lg border border-border/50 hover:shadow-lg transition-shadow bg-white dark:bg-darker-2 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}>
        {/* Flexbox Layout - Image Left, Content Right */}
        <div className="flex flex-col md:flex-row">
          {/* Left - Image Section */}
          <div className="md:w-1/2 lg:w-1/2 flex-shrink-0">
            <div className=" aspect-[4/3] h-full overflow-hidden bg-gray-100 dark:bg-darker relative">
              <img
                src={reward.imageUrl || reward.image}
                alt={reward.imageAlt || reward.title}
                className="w-full h-full object-cover"
              />

              {/* SOLD OUT Overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-8 py-4 rounded-sm font-bold text-2xl shadow-lg transform -rotate-12">
                    ĐÃ HẾT
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {reward.featured && !isSoldOut && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-sm">
                    NỔI BẬT
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Content Section */}
          <div className="flex-1 flex flex-col justify-between bg-white dark:bg-darker-2">
            <div className="p-5 md:p-7">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight"
                style={{ fontFamily: "'Roboto Slab', serif" }}>
                {reward.title}
              </h3>

              {/* Price Section */}
              <div className="mb-4">
                <span className="text-[22px] font-bold text-primary">
                  {formatPrice(reward.minPledgedAmount)} <span className="text-base">VND</span>
                </span>
              </div>

              {/* Perks info if available */}
              {reward.perk_name && (
                <p className="text-base text-foreground font-semibold mb-4">
                  {reward.perkName}
                </p>
              )}

              {/* More info link */}
              <div onClick={() => setIsModalOpen(true)} className="text-primary text-sm font-semibold hover:underline mb-6 inline-flex items-center gap-1">
                Xem thêm <ChevronRight className="w-4 h-4" />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-foreground">{reward.backers || 0} lượt ủng hộ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{reward.shipsTo}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-auto">
              {showChooseButton ? (
                <div className="space-y-3 p-5 md:p-7 pt-0">
                  <Button
                    className="w-full font-bold text-white bg-primary hover:bg-primary/90 shadow-lg h-14 text-base"
                    onClick={() => !isSoldOut && setIsModalOpen(true)}
                    disabled={isSoldOut}
                  >
                    {isSoldOut ? 'ĐÃ HẾT - KHÔNG KHẢ DỤNG' : 'CHỌN GÓI NÀY'}
                  </Button>
                  {!isSoldOut && (
                    <>
                      <div className="text-center text-sm font-semibold text-muted-foreground">HOẶC</div>
                      <Button
                        variant="outline"
                        className="w-full font-bold h-14 text-base border-2 border-primary text-primary hover:bg-primary/10"
                        onClick={() => setIsModalOpen(true)}
                      >
                        + CHỌN GÓI KHÁC
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full font-bold text-white bg-primary hover:bg-primary/90 shadow-lg rounded-none rounded-b-r-lg h-11 text-base"
                  onClick={() => !isSoldOut && setIsModalOpen(true)}
                  disabled={isSoldOut}
                >
                  {isSoldOut ? 'ĐÃ HẾT' : 'THÊM VÀO GIỎ'}
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
      />
    </>
  );
}
