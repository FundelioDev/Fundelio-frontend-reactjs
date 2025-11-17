import { webSocketClient } from '../WebSocketClient';

/**
 * WebSocket Service cho Campaign
 * Xử lý các subscription và events liên quan đến campaign
 */

/**
 * Subscribe tới campaign progress updates
 * @param {string} campaignId - ID của campaign
 * @param {function} callback - Callback nhận progress data
 * @returns {string} subscriptionId
 */
export const subscribeToCampaignProgress = (campaignId, callback) => {
  const destination = `/public/campaign/${campaignId}/progress`;
  return webSocketClient.subscribe(destination, callback);
};

/**
 * Unsubscribe từ campaign progress
 * @param {string} subscriptionId
 */
export const unsubscribeFromCampaignProgress = (subscriptionId) => {
  webSocketClient.unsubscribe(subscriptionId);
};
