import { useState } from 'react';

// Notification Hook
export const useNotification = () => {
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
    const showNotification = (type: 'success' | 'error', message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
    };
  
    return { notification, showNotification };
  };