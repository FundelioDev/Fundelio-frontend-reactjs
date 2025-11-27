import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

/**
 * PledgeNoRewardCard Component
 * Allows users to pledge without selecting a reward
 */
const PledgeNoRewardCard = ({ currency = 'VND', onPledge, isPreview = false, isOwnerViewing = false, campaignId }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const isInteractionDisabled = isPreview || isOwnerViewing;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (value && value > 0 && !isInteractionDisabled && campaignId) {
      // Navigate to pledge page with data
      const pledgeData = {
        campaignId: campaignId,
        // rewardId: null, // No reward selected
        amount: value, // Required field
        bonusAmount: 0,
        totalAmount: value,
        addOns: [], // No add-ons
        hasNoReward: true, // Flag to hide bonus amount input
      };

      navigate(`/campaigns/${campaignId}/pledge`, {
        state: { pledgeData }
      });

      // Call onPledge callback if provided (for backward compatibility)
      onPledge?.({ amount: value, currency });
      setAmount('');
    }
  };

  return (
    <div className="border border-border rounded-sm p-4 bg-white dark:bg-darker-2 shadpw-sm">
      <h3 className="text-base font-semibold text-foreground mb-3">
        Ủng hộ mà không chọn phần thưởng
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Amount Input */}
        <div className="mb-4">
          <label
            htmlFor="pledge-amount"
            className="block text-sm font-medium text-text-secondary dark:text-white mb-2"
          >
            Số tiền ủng hộ
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-white">
              <span className="text-sm font-semibold text-muted-foreground">VND</span>
            </span>
            <input
              id="pledge-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-white dark:bg-darker text-text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={isInteractionDisabled}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-b from-muted to-muted/40 rounded-xl p-4 mb-4">
          <p className="text-sm text-text-secondary dark:text-white">
            Chỉ muốn hỗ trợ dự án? Bạn có thể ủng hộ bất kỳ số tiền nào mà không cần chọn cấp phần thưởng. Sự đóng góp của bạn vẫn sẽ giúp chiến dịch này thành công!
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isInteractionDisabled || !amount || parseFloat(amount) <= 0}
        >
          {isPreview
            ? 'Không khả dụng'
            : isOwnerViewing
              ? 'Tác giả không thể tự ủng hộ'
              : 'Ủng hộ'}
        </Button>
      </form>
    </div>
  );
};

export default PledgeNoRewardCard;
