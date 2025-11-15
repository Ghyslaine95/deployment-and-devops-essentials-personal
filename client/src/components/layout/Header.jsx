import React from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { Button } from '../ui/Button';

export const Header = () => {
  const { isConnected, currentRoom, user, disconnect } = useSocketContext();

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Socket.io Chat</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">#{currentRoom}</span>
          {user && (
            <span className="ml-4">Welcome, {user.username}</span>
          )}
        </div>
        
        <Button
          variant="outline"
          size="small"
          onClick={disconnect}
        >
          Leave Chat
        </Button>
      </div>
    </header>
  );
};