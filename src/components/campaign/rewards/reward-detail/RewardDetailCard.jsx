import { motion } from 'framer-motion';
import { UsersIcon, MapPinIcon, CalendarIcon, PackageIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
// import type { Reward } from '@/stores/rewardStore';

// interface RewardDetailCardProps {
//   reward: Reward;
// }

export function RewardDetailCard({ reward }) {
  const percentageRemaining = reward.limitedQuantity
    ? (reward.limitedQuantity.remaining / reward.limitedQuantity.total) * 100
    : 100;

  console.log('reward in RewardDetailCard:', reward);

  // Format delivery date
  const eta = reward.estimated_delivery
    ? new Date(reward.estimated_delivery).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'TBD';

  return (
    <Card className="overflow-hidden border border-border/50 h-fit sticky top-8 max-w-[380px] mx-auto">
      {/* Image Section - 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden bg-white dark:bg-darker-2">
        <img
          src={reward.image_url || reward.image}
          alt={reward.imageAlt || reward.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section - Reduced padding */}
      <div className="p-4 bg-white dark:bg-darker-2">
        <h3 className="text-base font-bold text-foreground mb-3 leading-tight">
          {reward.title}
        </h3>

        {/* Stats Grid - Vertical layout for narrow card */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm gradient-2 flex items-center justify-center flex-shrink-0">
              <UsersIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Người ủng hộ</p>
              <p className="text-base font-bold text-primary">{reward.backers}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm gradient-3 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Giao đến</p>
              <p className="text-xs font-semibold text-foreground">{reward.ships_to}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info - Smaller */}
        <div
          className="p-3 rounded-sm mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(8, 148, 226, 0.08) 0%, rgba(30, 199, 148, 0.08) 100%)',
            border: '1px solid rgba(8, 148, 226, 0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" strokeWidth={2} />
            <div>
              <p className="text-xs text-muted-foreground">Thời gian giao hàng dự kiến</p>
              <p className="text-sm font-semibold text-foreground">{eta}</p>
            </div>
          </div>
        </div>

        {/* Limited Quantity - Smaller */}
        {reward.limitedQuantity && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-warning" strokeWidth={2} />
                <span className="text-xs font-semibold text-foreground">Số lượng giới hạn</span>
              </div>
              <span className="text-xs font-bold text-warning">
                {reward.limitedQuantity.remaining} left of {reward.limitedQuantity.total}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: percentageRemaining > 50
                    ? 'linear-gradient(90deg, #1EC794 0%, #0894E2 100%)'
                    : percentageRemaining > 25
                      ? 'linear-gradient(90deg, #FFB700 0%, #FF9603 100%)'
                      : 'linear-gradient(90deg, #FF6D03 0%, #C44C93 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${percentageRemaining}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* CTA Button - Smaller */}
        <Button
          className="w-full font-bold text-white bg-primary shadow-lg h-10 text-sm flex items-center justify-center gap-2"
        >
          <span>Ủng hộ {reward.min_pledge_amount}</span>
          <img src="/packages/coin.svg" alt="Coin" className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
