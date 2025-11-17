import { Client } from '@stomp/stompjs';
import { storageService } from '@/services/storage';

/**
 * WebSocket Client Service
 * Quản lý kết nối WebSocket và STOMP subscriptions
 */
class WebSocketClient {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
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

      // Tự động reconnect
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.client.activate();
  }

  /**
   * Subscribe tới một destination
   * @param {string} destination - Destination path
   * @param {function} callback - Callback nhận message
   * @returns {string} subscriptionId
   */
  subscribe(destination, callback) {
    if (!this.client?.connected) {
      console.warn('⚠️ WebSocket chưa kết nối, không thể subscribe:', destination);
      return null;
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`📨 [${destination}]:`, data);
          callback(data);
        } catch (error) {
          console.error('Error parsing message:', error);
          callback(message.body);
        }
      });

      const subscriptionId = subscription.id;
      this.subscriptions.set(subscriptionId, subscription);
      console.log(`✅ Subscribed to: ${destination}`);
      
      return subscriptionId;
    } catch (error) {
      console.error('Error subscribing:', error);
      return null;
    }
  }

  /**
   * Unsubscribe từ một destination
   * @param {string} subscriptionId
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`✅ Unsubscribed: ${subscriptionId}`);
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
