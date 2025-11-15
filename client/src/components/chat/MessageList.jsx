import React, { useEffect, useRef } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { Message } from './Message';

export const MessageList = () => {
  const { messages, typingUsers, currentRoom } = useSocketContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const roomMessages = messages.filter(
    message => !message.room || message.room === currentRoom || message.isPrivate
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {roomMessages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        roomMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
      
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <div className="flex items-center space-x-2 text-gray-500 italic">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};