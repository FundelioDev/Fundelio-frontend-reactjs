import { useEffect } from 'react';
import { webSocketClient } from '@/websocket';

/**
 * Hook để tự động kết nối WebSocket
 * Sử dụng trong RootLayout
 * Kết nối ngay khi vào website, không cần đăng nhập
 */
export const useWebSocketConnection = () => {
  useEffect(() => {
    console.log('🔌 Auto connecting WebSocket...');
    
    // Setup callbacks để log kết nối
    webSocketClient.onConnect(() => {
      console.log('✅ WebSocket connected successfully!');
    });

    webSocketClient.onError((error) => {
      console.error('❌ WebSocket connection failed:', error);
    });

    webSocketClient.onClose((event) => {
      console.warn('⚠️ WebSocket connection closed:', event.reason || 'Unknown reason');
    });

    // Kết nối ngay
    webSocketClient.connect();

    // Cleanup khi unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      webSocketClient.disconnect();
    };
  }, []); // Chỉ chạy 1 lần khi mount

  return webSocketClient;
};
