import { useState, useEffect } from 'react';

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    type: 'unknown',
    downlink: 0,
    effectiveType: 'unknown',
    isOnline: navigator.onLine,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        setNetworkInfo({
          type: connection.type || 'unknown',
          downlink: connection.downlink || 0,
          effectiveType: connection.effectiveType || 'unknown',
          isOnline: navigator.onLine,
        });
      } else {
        setNetworkInfo({ ...networkInfo, isOnline: navigator.onLine });
      }
    };

    updateNetworkInfo();
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
    };
  }, []);

  return networkInfo;
};
