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
  console.log('🔔 Subscribing to campaign progress:', destination);
  const subId = webSocketClient.subscribe(destination, callback);
  console.log('🔔 Campaign progress subscription ID:', subId);
  return subId;
};

/**
 * Unsubscribe từ campaign progress
 * @param {string} subscriptionId
 */
// export const unsubscribeFromCampaignProgress = (subscriptionId) => {
//   webSocketClient.unsubscribe(subscriptionId);
// };
