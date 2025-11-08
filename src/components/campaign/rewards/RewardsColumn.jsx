import React from 'react';
import CreatorInfoCard from './CreatorInfoCard';
import PledgeNoRewardCard from './PledgeNoRewardCard';
import RewardCard from './RewardCard';

/**
 * RewardsColumn Component
 * Left column displaying creator info, pledge options, and all rewards
 */
const RewardsColumn = ({
  rewards = [],
  creator,
  currency = 'USD',
  onPledge,
}) => {
  return (
    <div className="space-y-4 sticky top-[88px] max-h-[calc(100vh-88px)] overflow-auto pr-2 scrollbar-primary">
      {/* Creator Info */}
      {creator && <CreatorInfoCard creator={creator} />}

      {/* Pledge Without Reward */}
      <PledgeNoRewardCard
        currency={currency}
        onPledge={(pledge) =>
          onPledge && onPledge({ type: 'no-reward', ...pledge })
        }
      />

      {/* All Rewards */}
      {rewards.map((reward) => (
        <RewardCard
          key={reward.reward_id || reward.id}
          reward={reward}
          layoutMode="vertical"
          onPledge={(r) => onPledge && onPledge({ type: 'reward', reward: r })}
        />
      ))}
    </div>
  );
};

export default RewardsColumn;
