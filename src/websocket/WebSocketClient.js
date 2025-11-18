import { Client } from '@stomp/stompjs';
import { storageService } from '@/services/storage';

/**
 * WebSocket Client Service
 * Quản lý kết nối WebSocket và STOMP subscriptions
 */
class WebSocketClient {
  constructor() {
    this.client = null;
    this.subscriptions = new Map(); // subscriptionId -> subscription object
    this.destinationCallbacks = new Map(); // destination -> Set of callbacks
    this.destinationSubscriptionIds = new Map(); // destination -> subscriptionId
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
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
      console.log('� Kết nối WebSocket với authentication');
    }

    this.client = new Client({
      brokerURL: 'wss://fundelio.duckdns.org/ws',
      connectHeaders,
      
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
        
        // Gọi callback nếu có
        if (this.onConnectCallback) {
          this.onConnectCallback(frame);
        }
      },

      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame.headers.message || 'Unknown error');
        console.error('❌ Error details:', frame.body);
        console.error('❌ Full frame:', frame);
        this.isConnecting = false;
        
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
    const token = storageService.getAccessToken();

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        // headers: {
        //     Authorization: `Bearer ${token}`
        // }
      });
      console.log(`📤 Sent to [${destination}]:`, body);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Ngắt kết nối
   */
  disconnect() {
    if (this.client) {
      // Unsubscribe tất cả
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions.clear();
      this.destinationCallbacks.clear();
      this.destinationSubscriptionIds.clear();

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
}

// Export singleton instance
export const webSocketClient = new WebSocketClient();
