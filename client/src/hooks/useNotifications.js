import { useState, useCallback, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return permission === 'granted';
  }, [permission]);

  const showNotification = useCallback((title, options = {}) => {
    if (!('Notification' in window) || permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }, [permission]);

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Silent fail if audio can't play
    });
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    playNotificationSound,
    canNotify: permission === 'granted'
  };
};