import React, { useState } from 'react';
import Button from '@/components/common/Button';

/**
 * PledgeNoRewardCard Component
 * Allows users to pledge without selecting a reward
 */
const PledgeNoRewardCard = ({ currency = 'USD', onPledge }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (value && value > 0) {
      onPledge({ amount: value, currency });
    }
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <h3 className="text-base font-semibold text-foreground mb-3">
        Make a pledge without a reward
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Amount Input */}
        <div className="mb-4">
          <label
            htmlFor="pledge-amount"
            className="block text-sm font-medium text-text-secondary dark:text-text-white mb-2"
          >
            Pledge amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-white">
              {currency === 'USD' ? '$' : currency}
            </span>
            <input
              id="pledge-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-secondary dark:text-text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-b from-muted to-muted/40 rounded-xl p-4 mb-4">
          <p className="text-sm text-text-secondary dark:text-text-white">
            Simply want to support the project? You can pledge any amount
            without selecting a reward tier. Your contribution will still help
            make this campaign a success!
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Back it
        </Button>
      </form>
    </div>
  );
};

export default PledgeNoRewardCard;
