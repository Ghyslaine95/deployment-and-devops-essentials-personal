import { useState, useRef, useCallback } from 'react';

export const useTypingIndicator = (onTypingStart, onTypingStop, delay = 1000) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop();
    }, delay);
  }, [isTyping, onTypingStart, onTypingStop, delay]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
    }
  }, [isTyping, onTypingStop]);

  return {
    isTyping,
    handleTyping,
    stopTyping
  };
};