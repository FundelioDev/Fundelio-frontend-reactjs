import { useEffect, useRef } from 'react';
import { 
  subscribeToCampaignProgress,
 
} from '@/websocket';
// unsubscribeFromCampaignProgress
/**
 * Hook để subscribe campaign progress
 * @param {string} campaignId - ID của campaign
 * @param {function} onProgress - Callback khi có progress update
 */
export const useCampaignProgress = (campaignId, onProgress) => {
  const subscriptionIdRef = useRef(null);
  const onProgressRef = useRef(onProgress);

  // Update ref khi callback thay đổi, nhưng không trigger re-subscribe
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    if (!campaignId) return;

    // Wrap callback trong ref để luôn gọi version mới nhất
    const wrappedCallback = (data) => {
      if (onProgressRef.current) {
        onProgressRef.current(data);
      }
    };

    // Subscribe
    subscriptionIdRef.current = subscribeToCampaignProgress(campaignId, wrappedCallback);

    // Cleanup: Unsubscribe khi unmount hoặc campaignId thay đổi
    return () => {
      if (subscriptionIdRef.current) {
        console.log('🔌 Unsubscribing from campaign progress:', campaignId);
        // unsubscribeFromCampaignProgress(subscriptionIdRef.current);
      }
    };
  }, [campaignId]); // CHỈ phụ thuộc vào campaignId, KHÔNG phụ thuộc vào onProgress
};
