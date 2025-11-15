const formatMessage = (username, content, room, type = 'text') => {
  return {
    id: Date.now().toString(),
    username,
    content,
    timestamp: new Date().toISOString(),
    room,
    type
  };
};

const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 2 || username.length > 20) {
    return { valid: false, error: 'Username must be between 2 and 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true };
};

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const sanitizeMessage = (content) => {
  // Basic sanitization to prevent XSS
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = {
  formatMessage,
  validateUsername,
  generateRoomId,
  sanitizeMessage
};