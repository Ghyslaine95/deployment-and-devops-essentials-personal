import React from 'react';
import { useSocketContext } from '../context/SocketContext';
import { Button } from './ui/Button';

export const NotificationCenter = () => {
  const { notifications, clearNotifications } = useSocketContext();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {notifications.length > 1 && (
        <div className="flex justify-end">
          <Button
            size="small"
            variant="outline"
            onClick={clearNotifications}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};