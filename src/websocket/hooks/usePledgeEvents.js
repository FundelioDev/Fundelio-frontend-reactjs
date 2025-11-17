import { useEffect, useRef, useState } from 'react';
import { 
  subscribeToPledgeSuccess, 
  subscribeToErrors,
  unsubscribeFromPledgeSuccess,
  unsubscribeFromErrors,
  webSocketClient
} from '@/websocket';

/**
 * Hook để subscribe pledge events
 * @param {function} onSuccess - Callback khi pledge success
 * @param {function} onError - Callback khi có error
 */
export const usePledgeEvents = (onSuccess, onError) => {
  const successSubIdRef = useRef(null);
  const errorSubIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Đợi WebSocket connected
    const checkConnection = () => {
      if (webSocketClient.isConnected()) {
        console.log('✅ WebSocket ready, subscribing to pledge events...');
        setIsReady(true);
      } else {
        console.log('⏳ Waiting for WebSocket connection...');
        setTimeout(checkConnection, 500);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    console.log('📡 Setting up pledge subscriptions...');

    // Subscribe to pledge success
    if (onSuccess) {
      successSubIdRef.current = subscribeToPledgeSuccess(onSuccess);
    }

    // Subscribe to errors
    if (onError) {
      errorSubIdRef.current = subscribeToErrors(onError);
    }

    // Cleanup
    return () => {
      if (successSubIdRef.current) {
        console.log('🔌 Unsubscribing from pledge success');
        unsubscribeFromPledgeSuccess(successSubIdRef.current);
      }
      
      if (errorSubIdRef.current) {
        console.log('🔌 Unsubscribing from errors');
        unsubscribeFromErrors(errorSubIdRef.current);
      }
    };
  }, [isReady, onSuccess, onError]);
};
