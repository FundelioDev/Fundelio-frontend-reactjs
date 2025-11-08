import { motion } from 'framer-motion';
import { RewardDetailCard } from './RewardDetailCard';
import { RewardItem } from './RewardItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusIcon, MinusIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

// interface IncludedItem {
//   id: string;
//   name: string;
//   quantity: number;
//   image?: string;
//   badge?: string;
//   description?: string;
// }

// interface AddOnItem {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   quantity: number;
// }

// interface RewardDetailSectionProps {
//   reward: Reward;
// }

export function RewardDetailSection({ reward, items = [], addOns: availableAddOns = [] }) {
  // Get included items from reward.items array
  const includedItems = (reward.items || []).map((selectedItem) => {
    const item = items.find((i) => i.id === selectedItem.itemId);
    return {
      id: selectedItem.itemId,
      name: item?.title || 'Unknown Item',
      image: item?.image || 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: selectedItem.qty,
      badge: 'ĐÃ BAO GỒM',
      description: item?.description || '',
    };
  });

  // Filter add-ons that are allowed for this reward
  const filteredAddOns = availableAddOns.filter((addon) => {
    // If addon has offeredWithRewardIds, check if this reward is included
    if (addon.offeredWithRewardIds && Array.isArray(addon.offeredWithRewardIds)) {
      return addon.offeredWithRewardIds.includes(reward.id || reward.reward_id);
    }
    // If no offeredWithRewardIds, include all add-ons (backward compatibility)
    return true;
  });

  // Initialize add-ons with quantity state
  const [addOns, setAddOns] = useState(
    filteredAddOns.map((addon) => ({
      ...addon,
      quantity: 0,
    }))
  );

  const updateQuantity = (id, delta) => {
    setAddOns((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAddOnsPrice = addOns.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8">
      {/* Left Column - Reward Card (35%) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RewardDetailCard reward={reward} />
      </motion.div>

      {/* Right Column - Details (65%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-8"
      >
        {/* Description */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Tùy chỉnh khoản ủng hộ với tiện ích bổ sung
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {reward.description}
          </p>
        </Card>

        {/* Included Items */}
        <div className="flex items-center justify-between mb-5 mt-12">
          <h3 className="text-lg font-bold text-foreground">
            {includedItems.length} mục đã bao gồm
          </h3>
          <div className="w-8 h-8 rounded-sm gradient-2 flex items-center justify-center">
            <CheckIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-4">
          {includedItems.map((item) => (
            <RewardItem
              key={item.id}
              item={item}
              variant="default"
              rightContent={
                item.badge && (
                  <span
                    className="px-3 py-1 rounded-sm text-xs font-bold text-white bg-primary"

                  >
                    {item.badge}
                  </span>
                )
              }
            />
          ))}
        </div>


        {/* Add-ons */}
        {addOns.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-foreground mb-5 mt-12">
              Tiện ích bổ sung tùy chọn
            </h3>

            <div className="space-y-5">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RewardItem
                    item={{
                      id: addon.id,
                      name: addon.title,
                      image: addon.image,
                      description: addon.description,
                      quantity: 1,
                    }}
                    variant="addon"
                    showQuantity={false}
                    rightContent={
                      <div className="flex flex-col gap-3">
                        <div
                          className="px-2 py-1 rounded-sm font-bold text-white bg-primary shadow-md whitespace-nowrap text-center"
                        >
                          {addon.price} <span className="text-sm font-semibold text-muted-foreground">VND</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-sm"
                            onClick={() => updateQuantity(addon.id, -1)}
                            disabled={addon.quantity === 0}
                          >
                            <MinusIcon className="w-4 h-4 text-text-primary dark:text-white" />
                          </Button>
                          <span className="font-semibold text-foreground min-w-[1.5rem] text-center">
                            {addon.quantity > 0 ? `×${addon.quantity}` : '0'}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-sm"
                            onClick={() => updateQuantity(addon.id, 1)}
                          >
                            <PlusIcon className="w-4 h-4 text-text-primary dark:text-white" />
                          </Button>
                        </div>
                      </div>
                    }
                  />

                  {/* Selected Indicator */}
                  {addon.quantity > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="px-4 py-2 gradient-2 text-white text-sm font-semibold mt-0 rounded-b-sm flex items-center justify-between"
                    >
                      <span>Đã thêm: {addon.quantity} ×</span>
                      <span className="flex items-center gap-1">
                        {addon.price} <span className="text-sm font-semibold text-muted-foreground">VND</span>
                        = {addon.quantity * addon.price} <span className="text-sm font-semibold text-muted-foreground">VND</span>
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Total */}
        {totalAddOnsPrice > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 183, 0, 0.1) 0%, rgba(255, 150, 3, 0.1) 100%)',
              border: '2px solid rgba(255, 183, 0, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Tổng tiện ích bổ sung:</span>
              <span className="text-xl font-bold text-accent flex items-center gap-1">
                +{totalAddOnsPrice} <span className="text-sm font-semibold text-muted-foreground">VND</span>
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-accent/20">
              <span className="text-lg font-bold text-foreground">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary flex items-center gap-1">
                {reward.price + totalAddOnsPrice} <span className="text-sm font-semibold text-muted-foreground">VND</span>
              </span>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
