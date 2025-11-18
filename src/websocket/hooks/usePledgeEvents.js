import { useEffect, useRef, useState } from 'react';
import { 
  subscribeToPledgeSuccess, 
  subscribeToErrors,
  // unsubscribeFromPledgeSuccess,
  // unsubscribeFromErrors,
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
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Update refs khi callbacks thay đổi
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

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

    // Wrap callbacks trong refs
    const wrappedSuccess = (data) => {
      if (onSuccessRef.current) {
        onSuccessRef.current(data);
      }
    };

    const wrappedError = (error) => {
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
    };

    // Subscribe to pledge success
    successSubIdRef.current = subscribeToPledgeSuccess(wrappedSuccess);

    // Subscribe to errors
    errorSubIdRef.current = subscribeToErrors(wrappedError);

    // Cleanup
    return () => {
      // Temporarily disabled - không unsubscribe để giữ connection
      // if (successSubIdRef.current) {
      //   console.log('🔌 Unsubscribing from pledge success');
      //   unsubscribeFromPledgeSuccess(successSubIdRef.current);
      // }
      
      // if (errorSubIdRef.current) {
      //   console.log('🔌 Unsubscribing from errors');
      //   unsubscribeFromErrors(errorSubIdRef.current);
      // }
    };
  }, [isReady]); // CHỈ phụ thuộc isReady, KHÔNG phụ thuộc callbacks
};
