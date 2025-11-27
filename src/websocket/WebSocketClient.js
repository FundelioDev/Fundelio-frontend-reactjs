import { Client } from '@stomp/stompjs';
import { storageService } from '@/services/storage';

// Custom event name for token refresh
export const TOKEN_REFRESHED_EVENT = 'auth:token-refreshed';

/**
 * WebSocket Client Service
 * Quản lý kết nối WebSocket và STOMP subscriptions
 * Hỗ trợ auto-reconnect khi token được refresh
 */
class WebSocketClient {
  constructor() {
    this.client = null;
    this.subscriptions = new Map(); // subscriptionId -> subscription object
    this.destinationCallbacks = new Map(); // destination -> Set of callbacks
    this.destinationSubscriptionIds = new Map(); // destination -> subscriptionId

    // Lưu trữ pending subscriptions để re-subscribe sau reconnect
    this.pendingSubscriptions = new Map(); // destination -> Set of callbacks (lưu lại khi disconnect)

    this.isConnecting = false;
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;

    // Listen for token refresh event
    this._setupTokenRefreshListener();
  }

  /**
   * Setup listener cho sự kiện token refresh
   * Khi token được refresh, tự động reconnect với token mới
   */
  _setupTokenRefreshListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener(TOKEN_REFRESHED_EVENT, (event) => {
      console.log('🔄 [WebSocket] Token refreshed event received');

      const newToken = event.detail?.accessToken;
      if (!newToken) {
        console.warn('⚠️ [WebSocket] Token refresh event without token');
        return;
      }

      // Nếu đang kết nối, reconnect với token mới
      if (this.client?.connected || this.isConnecting) {
        console.log('🔄 [WebSocket] Reconnecting with new token...');
        this.reconnectWithNewToken();
      }
    });

    console.log('✅ [WebSocket] Token refresh listener setup complete');
  }

  /**
   * Reconnect WebSocket với token mới
   * Lưu lại tất cả subscriptions, disconnect, rồi connect lại và re-subscribe
   */
  reconnectWithNewToken() {
    if (this.isReconnecting) {
      console.log('⚠️ [WebSocket] Already reconnecting, skip...');
      return;
    }

    this.isReconnecting = true;
    console.log('🔄 [WebSocket] Starting reconnect with new token...');

    // 1. Lưu lại tất cả destinations và callbacks hiện tại
    this._savePendingSubscriptions();

    // 2. Disconnect (không clear pendingSubscriptions)
    this._disconnectForReconnect();

    // 3. Đợi lâu hơn để server kịp xử lý token mới (tăng từ 500ms lên 1500ms)
    setTimeout(() => {
      console.log('🔄 [WebSocket] Attempting reconnect with refreshed token...');
      this.connect();
    }, 1500);
  }

  /**
   * Lưu lại tất cả subscriptions để re-subscribe sau
   */
  _savePendingSubscriptions() {
    console.log('📋 [WebSocket] Saving pending subscriptions...');

    // Copy destinationCallbacks sang pendingSubscriptions
    this.pendingSubscriptions.clear();

    for (const [destination, callbacks] of this.destinationCallbacks.entries()) {
      // Clone Set để tránh reference issues
      this.pendingSubscriptions.set(destination, new Set(callbacks));
      console.log(`  📌 Saved: ${destination} (${callbacks.size} callbacks)`);
    }

    console.log(`📋 [WebSocket] Total ${this.pendingSubscriptions.size} destinations saved`);
  }

  /**
   * Disconnect nhưng giữ lại pendingSubscriptions
   */
  _disconnectForReconnect() {
    if (this.client) {
      // Unsubscribe tất cả subscriptions hiện tại
      this.subscriptions.forEach(subscription => {
        try {
          subscription.unsubscribe();
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      this.subscriptions.clear();
      this.destinationCallbacks.clear();
      this.destinationSubscriptionIds.clear();

      // Deactivate client
      this.client.deactivate();
      this.client = null;

      console.log('🔌 [WebSocket] Disconnected for reconnect (subscriptions preserved)');
    }
  }

  /**
   * Re-subscribe tất cả pending subscriptions sau khi connect thành công
   */
  _resubscribePendingSubscriptions() {
    if (this.pendingSubscriptions.size === 0) {
      console.log('📋 [WebSocket] No pending subscriptions to restore');
      return;
    }

    console.log(`🔄 [WebSocket] Re-subscribing ${this.pendingSubscriptions.size} destinations...`);

    for (const [destination, callbacks] of this.pendingSubscriptions.entries()) {
      // Subscribe lại destination này
      for (const callback of callbacks) {
        this.subscribe(destination, callback);
      }
      console.log(`  ✅ Re-subscribed: ${destination} (${callbacks.size} callbacks)`);
    }

    // Clear pending sau khi đã re-subscribe xong
    this.pendingSubscriptions.clear();
    this.isReconnecting = false;

    console.log('✅ [WebSocket] All subscriptions restored');
  }

  /**
   * Kết nối tới WebSocket server
   */
  connect() {
    if (this.client?.connected || this.isConnecting) {
      console.log('⚠️ WebSocket đã kết nối hoặc đang kết nối');
      return;
    }

    this.isConnecting = true;
    console.log('🔌 Đang kết nối WebSocket...');

    const accessToken = storageService.getAccessToken();

    // Tạo connectHeaders - token là optional
    const connectHeaders = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    if (!accessToken) {
      console.warn('⚠️ Kết nối WebSocket không có token (anonymous mode)');
    } else {
      console.log('🔐 Kết nối WebSocket với authentication');
      console.log('🔑 Token (first 20 chars):', accessToken.substring(0, 20) + '...');
    }

    this.client = new Client({
      brokerURL: 'wss://fundelio.duckdns.org/ws',
      connectHeaders: {
        ...connectHeaders,
        // Thêm các headers chuẩn STOMP
        'accept-version': '1.2,1.1,1.0',
        'heart-beat': '10000,10000',
      },

      // Debug mode (tắt trong production)
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', str);
        }
      },

      onConnect: (frame) => {
        console.log('✅ WebSocket connected successfully');
        console.log('📡 Connection frame:', frame);
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Re-subscribe pending subscriptions nếu đang reconnect
        if (this.isReconnecting || this.pendingSubscriptions.size > 0) {
          // Đợi một chút để connection ổn định
          setTimeout(() => {
            this._resubscribePendingSubscriptions();
          }, 100);
        }

        // Gọi callback nếu có
        if (this.onConnectCallback) {
          this.onConnectCallback(frame);
        }
      },

      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame.headers?.message || 'Unknown error');
        console.error('❌ Error code:', frame.headers?.code);
        console.error('❌ Error details:', frame.body);
        console.error('❌ Full error frame:', JSON.stringify(frame, null, 2));
        this.isConnecting = false;
        this.isReconnecting = false;

        // Gọi callback nếu có
        if (this.onErrorCallback) {
          this.onErrorCallback(frame);
        }
      },

      onWebSocketClose: (event) => {
        console.warn('⚠️ WebSocket closed');
        console.warn('⚠️ Code:', event.code);
        console.warn('⚠️ Reason:', event.reason || 'No reason provided');
        console.warn('⚠️ Was clean:', event.wasClean);
        this.isConnecting = false;

        // Gọi callback nếu có
        if (this.onCloseCallback) {
          this.onCloseCallback(event);
        }
      },

      onWebSocketError: (error) => {
        console.error('❌ WebSocket error occurred');
        console.error('❌ Error:', error);
        this.isConnecting = false;
      },

    });

    this.client.activate();
  }

  /**
   * Subscribe tới một destination
   * Nếu destination đã có subscription, chỉ thêm callback vào list
   * @param {string} destination - Destination path
   * @param {function} callback - Callback nhận message
   * @returns {string} subscriptionId (hoặc unique callback ID)
   */
  subscribe(destination, callback) {
    if (!this.client?.connected) {
      console.warn('⚠️ WebSocket chưa kết nối, không thể subscribe:', destination);

      // Lưu vào pending để subscribe sau khi connect
      if (!this.pendingSubscriptions.has(destination)) {
        this.pendingSubscriptions.set(destination, new Set());
      }
      this.pendingSubscriptions.get(destination).add(callback);
      console.log(`📋 Added to pending subscriptions: ${destination}`);

      return null;
    }

    try {
      // Kiểm tra xem destination đã có subscription chưa
      const existingSubId = this.destinationSubscriptionIds.get(destination);

      if (existingSubId) {
        // Destination đã được subscribe, chỉ thêm callback vào set
        const callbacks = this.destinationCallbacks.get(destination);
        callbacks.add(callback);
        console.log(`✅ Added callback to existing subscription: ${destination} (${callbacks.size} callbacks)`);

        // Trả về unique ID cho callback này để có thể unsubscribe riêng
        return `${existingSubId}-callback-${callbacks.size}`;
      }

      // Chưa có subscription cho destination này, tạo mới
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`📨 [${destination}]:`, data);

          // Gọi tất cả callbacks đã đăng ký cho destination này
          const callbacks = this.destinationCallbacks.get(destination);
          if (callbacks) {
            callbacks.forEach(cb => {
              try {
                cb(data);
              } catch (err) {
                console.error('Error in callback:', err);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing message:', error);

          // Fallback: gọi callbacks với raw body
          const callbacks = this.destinationCallbacks.get(destination);
          if (callbacks) {
            callbacks.forEach(cb => cb(message.body));
          }
        }
      });

      const subscriptionId = subscription.id;
      this.subscriptions.set(subscriptionId, subscription);
      this.destinationSubscriptionIds.set(destination, subscriptionId);

      // Tạo Set cho callbacks của destination này
      const callbackSet = new Set([callback]);
      this.destinationCallbacks.set(destination, callbackSet);

      console.log(`✅ New subscription to: ${destination} (ID: ${subscriptionId})`);

      return subscriptionId;
    } catch (error) {
      console.error('Error subscribing:', error);
      return null;
    }
  }

  /**
   * Unsubscribe từ một destination
   * Nếu còn callbacks khác, chỉ xóa callback này
   * Nếu không còn callback nào, mới unsubscribe thật sự
   * @param {string} subscriptionId
   */
  unsubscribe(subscriptionId) {
    // Tìm destination tương ứng với subscriptionId
    let targetDestination = null;
    for (const [dest, subId] of this.destinationSubscriptionIds.entries()) {
      if (subId === subscriptionId || subscriptionId.startsWith(`${subId}-callback-`)) {
        targetDestination = dest;
        break;
      }
    }

    if (!targetDestination) {
      console.warn(`⚠️ Subscription not found: ${subscriptionId}`);
      return;
    }

    const callbacks = this.destinationCallbacks.get(targetDestination);

    // Nếu là callback ID (có dạng "sub-X-callback-Y"), chỉ xóa callback đó
    if (subscriptionId.includes('-callback-')) {
      // TODO: Để xóa callback cụ thể, cần lưu map callback -> callbackId
      // Hiện tại đơn giản hóa: nếu còn > 1 callback, giảm đi 1
      if (callbacks && callbacks.size > 1) {
        console.log(`⚠️ Cannot remove specific callback without reference, keeping subscription active`);
        return;
      }
    }

    // Không còn callback nào hoặc là subscription chính, unsubscribe thật sự
    const subscription = this.subscriptions.get(
      this.destinationSubscriptionIds.get(targetDestination)
    );

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      this.destinationSubscriptionIds.delete(targetDestination);
      this.destinationCallbacks.delete(targetDestination);
      console.log(`✅ Unsubscribed from: ${targetDestination}`);
    }
  }

  /**
   * Gửi message tới server
   * @param {string} destination - Destination path
   * @param {object} body - Message body
   */
  send(destination, body) {
    if (!this.client?.connected) {
      console.error('❌ WebSocket chưa kết nối, không thể gửi message');
      throw new Error('WebSocket not connected');
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
      console.log(`📤 Sent to [${destination}]:`, body);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Ngắt kết nối hoàn toàn (clear all)
   */
  disconnect() {
    if (this.client) {
      // Unsubscribe tất cả
      this.subscriptions.forEach(subscription => {
        try {
          subscription.unsubscribe();
        } catch (e) {
          // Ignore
        }
      });
      this.subscriptions.clear();
      this.destinationCallbacks.clear();
      this.destinationSubscriptionIds.clear();
      this.pendingSubscriptions.clear();

      this.client.deactivate();
      this.client = null;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected() {
    return this.client?.connected || false;
  }

  /**
   * Set callback khi connect thành công
   */
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  /**
   * Set callback khi có lỗi
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * Set callback khi đóng kết nối
   */
  onClose(callback) {
    this.onCloseCallback = callback;
  }

  /**
   * Lấy danh sách các destinations đang subscribe
   */
  getActiveSubscriptions() {
    return Array.from(this.destinationSubscriptionIds.keys());
  }
}

// Export singleton instance
export const webSocketClient = new WebSocketClient();
