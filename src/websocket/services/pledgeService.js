import { webSocketClient } from '../WebSocketClient';

/**
 * WebSocket Service cho Pledge
 * Xử lý các subscription và events liên quan đến pledge
 */

/**
 * Subscribe tới pledge success notifications (private)
 * @param {function} callback - Callback nhận pledge success data
 * @returns {string} subscriptionId
 */
export const subscribeToPledgeSuccess = (callback) => {
  const destination = '/client/private/pledge/success';
  console.log('🔔 Subscribing to pledge success:', destination);
  const subId = webSocketClient.subscribe(destination, callback);
  console.log('🔔 Pledge success subscription ID:', subId);
  return subId;
};

/**
 * Subscribe tới errors (private)
 * @param {function} callback - Callback nhận error data
 * @returns {string} subscriptionId
 */
export const subscribeToErrors = (callback) => {
  const destination = '/client/private/errors';
  console.log('🔔 Subscribing to errors:', destination);
  const subId = webSocketClient.subscribe(destination, callback);
  console.log('🔔 Error subscription ID:', subId);
  return subId;
};

/**
 * Gửi request tạo pledge
 * @param {object} pledgeData - Dữ liệu pledge
 * @param {string} pledgeData.campaignId - ID của campaign
 * @param {string} pledgeData.rewardId - ID của reward
 * @param {number} pledgeData.amount - Số tiền pledge
 * @param {number} pledgeData.bonusAmount - Số tiền bonus
 * @param {number} pledgeData.totalAmount - Tổng số tiền
 * @param {Array} pledgeData.addOns - Danh sách add-ons (optional)
 * @returns {Promise}
 */
export const createPledge = (pledgeData) => {
  const destination = '/server/pledge/create';
  
  try {
    webSocketClient.send(destination, pledgeData);
    console.log('✅ Pledge request sent successfully');
    console.log('📦 Payload:', pledgeData);
  } catch (error) {
    console.error('❌ Failed to send pledge request:', error);
    throw error;
  }
};

/**
 * Unsubscribe từ pledge success
 * @param {string} subscriptionId
 */
// export const unsubscribeFromPledgeSuccess = (subscriptionId) => {
//   webSocketClient.unsubscribe(subscriptionId);
// };

/**
 * Unsubscribe từ errors
 * @param {string} subscriptionId
 */
// export const unsubscribeFromErrors = (subscriptionId) => {
//   webSocketClient.unsubscribe(subscriptionId);
// };
