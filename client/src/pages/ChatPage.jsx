import React from 'react';
import { useSocketContext } from '../context/SocketContext';
import { Header } from '../components/layout/Header';
import { RoomList } from '../components/chat/RoomList';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { UserList } from '../components/chat/UserList';
import { NotificationCenter } from '../components/NotificationCenter';

export const ChatPage = () => {
  const { isConnected } = useSocketContext();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <RoomList />
        
        <div className="flex-1 flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
        
        <UserList />
      </div>

      <NotificationCenter />
    </div>
  );
};