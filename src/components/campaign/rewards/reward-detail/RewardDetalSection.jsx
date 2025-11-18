import { motion } from 'framer-motion';
import { RewardDetailCard } from './RewardDetailCard';
import { AddOnCard } from './AddOnCard';
import { useState } from 'react';

export function RewardDetailSection({ rewards = [], items = [], addOns = [], onSelectReward, onSelectAddOn, campaignId }) {
  const [selectedAddOns, setSelectedAddOns] = useState({});

  const handleToggleAddOn = (addon) => {
    const key = addon.catalogItemId || addon.id;
    const newSelectedState = !selectedAddOns[key];

    setSelectedAddOns(prev => ({
      ...prev,
      [key]: newSelectedState
    }));

    if (onSelectAddOn) {
      onSelectAddOn(addon, newSelectedState);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rewards Section */}
      <div className="space-y-6">
        {rewards.map((reward, index) => {
          const rewardId = reward.rewardId || reward.reward_id || reward.id;

          return (
            <motion.div
              key={rewardId}
              id={String(rewardId)}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <RewardDetailCard
                reward={reward}
                items={items}
                addOns={addOns}
                onSelectReward={onSelectReward}
                campaignId={campaignId}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Add-ons Section */}
      {addOns.length > 0 && (
        <motion.div
          className="border-t border-border/50 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: rewards.length * 0.1 + 0.2 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Add-ons
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Thêm các tiện ích bổ sung để nâng cao trải nghiệm của bạn
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.catalogItemId || addon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AddOnCard
                  addon={addon}
                  isSelected={selectedAddOns[addon.catalogItemId || addon.id]}
                  onToggle={() => handleToggleAddOn(addon)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
