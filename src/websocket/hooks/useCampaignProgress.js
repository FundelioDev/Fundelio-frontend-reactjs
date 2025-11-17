import { useEffect, useRef } from 'react';
import { 
  subscribeToCampaignProgress,
  unsubscribeFromCampaignProgress
} from '@/websocket';

/**
 * Hook để subscribe campaign progress
 * @param {string} campaignId - ID của campaign
 * @param {function} onProgress - Callback khi có progress update
 */
export const useCampaignProgress = (campaignId, onProgress) => {
  const subscriptionIdRef = useRef(null);

  useEffect(() => {
    if (!campaignId || !onProgress) return;

    // Subscribe
    subscriptionIdRef.current = subscribeToCampaignProgress(campaignId, onProgress);

    // Cleanup: Unsubscribe khi unmount hoặc campaignId thay đổi
    return () => {
      if (subscriptionIdRef.current) {
        console.log('🔌 Unsubscribing from campaign progress:', campaignId);
        unsubscribeFromCampaignProgress(subscriptionIdRef.current);
      }
    };
  }, [campaignId, onProgress]);
};
