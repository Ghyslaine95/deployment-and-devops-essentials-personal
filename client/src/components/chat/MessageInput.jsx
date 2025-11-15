import React, { useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { useTypingIndicator } from '../../hooks/useTypingIndicator';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, setTyping, currentRoom } = useSocketContext();

  const { handleTyping, stopTyping } = useTypingIndicator(
    () => setTyping(true),
    () => setTyping(false),
    1000
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      stopTyping();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={`Message #${currentRoom}`}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onBlur={stopTyping}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!message.trim()}
          className="flex-shrink-0"
        >
          Send
        </Button>
      </form>
    </div>
  );
};