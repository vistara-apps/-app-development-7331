import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for Base MiniKit SDK integration
 * Provides functionality for Base MiniApp features
 */
export function useMiniKit() {
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if running in Base MiniApp environment
  useEffect(() => {
    const checkMiniAppEnvironment = () => {
      // Check for Base MiniApp specific properties
      const isBase = window?.ethereum?.isBase || 
                     window?.parent !== window || 
                     window?.location?.ancestorOrigins?.length > 0;
      
      setIsInMiniApp(isBase);
      setIsLoading(false);
    };

    checkMiniAppEnvironment();
  }, []);

  // Get user information from Base context
  const getUserInfo = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          setUserInfo({
            address: accounts[0],
            isConnected: true
          });
        }
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }, []);

  // Send transaction through Base MiniApp
  const sendTransaction = useCallback(async (transactionData) => {
    if (!isInMiniApp) {
      throw new Error('Not in Base MiniApp environment');
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionData],
      });
      
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [isInMiniApp]);

  // Share content through Base MiniApp
  const shareContent = useCallback(async (content) => {
    if (!isInMiniApp) {
      // Fallback to web share API
      if (navigator.share) {
        return navigator.share(content);
      }
      throw new Error('Sharing not supported');
    }

    // Base MiniApp specific sharing
    try {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'SHARE_CONTENT',
          data: content
        }, '*');
      }
    } catch (error) {
      console.error('Share failed:', error);
      throw error;
    }
  }, [isInMiniApp]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!isInMiniApp) {
      return Notification.requestPermission();
    }

    // Base MiniApp specific notification request
    try {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'REQUEST_NOTIFICATIONS',
          data: {}
        }, '*');
        return 'granted';
      }
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  }, [isInMiniApp]);

  // Send notification through Base MiniApp
  const sendNotification = useCallback(async (notification) => {
    if (!isInMiniApp) {
      if (Notification.permission === 'granted') {
        return new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon
        });
      }
      throw new Error('Notification permission not granted');
    }

    // Base MiniApp specific notification
    try {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'SEND_NOTIFICATION',
          data: notification
        }, '*');
      }
    } catch (error) {
      console.error('Send notification failed:', error);
      throw error;
    }
  }, [isInMiniApp]);

  // Save frame for quick access
  const saveFrame = useCallback(async () => {
    if (!isInMiniApp) {
      // Fallback: add to browser bookmarks or show instructions
      return false;
    }

    try {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'SAVE_FRAME',
          data: {
            title: 'RightCheck',
            description: 'Know Your Rights, Instantly'
          }
        }, '*');
        return true;
      }
    } catch (error) {
      console.error('Save frame failed:', error);
      return false;
    }
  }, [isInMiniApp]);

  return {
    isInMiniApp,
    userInfo,
    isLoading,
    getUserInfo,
    sendTransaction,
    shareContent,
    requestNotificationPermission,
    sendNotification,
    saveFrame
  };
}
