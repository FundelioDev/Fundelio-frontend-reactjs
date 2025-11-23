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
  campaignId,
  isPreview = false,
  isOwnerViewing = false,
}) => {

  const interactionLocked = isPreview || isOwnerViewing;
  const lockedMessage = isPreview
    ? 'Bạn đang ở chế độ xem trước nên không thể ủng hộ.'
    : 'Bạn là tác giả không thể tự ủng hộ chiến dịch của chính mình.';
  return (
    <div className="space-y-4 sticky top-[88px] max-h-[calc(100vh-88px)] overflow-auto pr-2 scrollbar-primary">
      {/* Creator Info */}
      {creator && <CreatorInfoCard creator={creator} />}

      {interactionLocked && (
        <div className="p-3 rounded-sm border border-amber-300 bg-amber-50 text-amber-900 text-sm">
          {lockedMessage}
        </div>
      )}

      {/* Pledge Without Reward */}
      <PledgeNoRewardCard
        currency={currency}
        isPreview={isPreview}
        isOwnerViewing={isOwnerViewing}
        campaignId={campaignId}
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
          campaignId={campaignId}
          isPreview={isPreview}
          isOwnerViewing={isOwnerViewing}
        />
      ))}
    </div>
  );
};

export default RewardsColumn;
