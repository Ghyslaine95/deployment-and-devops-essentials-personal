import React, { useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';

export const Message = ({ message }) => {
  const { user } = useSocketContext();
  const [showReactions, setShowReactions] = useState(false);
  
  const isOwnMessage = message.username === user?.username;
  const isSystemMessage = message.system;
  const isPrivateMessage = message.isPrivate;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleReaction = (emoji) => {
    // Implement reaction logic
    console.log(`Reacted with ${emoji} to message ${message.id}`);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div 
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        } ${isPrivateMessage ? 'border-l-4 border-purple-500' : ''}`}
      >
        {!isOwnMessage && (
          <div className="flex items-center space-x-2 mb-1">
            {isPrivateMessage && (
              <span className="text-purple-500 text-xs">🔒 Private</span>
            )}
            <span className="font-semibold text-sm">{message.username}</span>
          </div>
        )}
        
        <div className="break-words">{message.content}</div>
        
        <div className={`flex items-center justify-between mt-1 ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          
          {showReactions && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-xs hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};