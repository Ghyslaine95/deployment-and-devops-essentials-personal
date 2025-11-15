const messages = {
  general: [],
  random: [],
  tech: []
};

const saveMessage = (room, message) => {
  if (!messages[room]) {
    messages[room] = [];
  }
  
  messages[room].push(message);
  
  // Keep only last 200 messages per room
  if (messages[room].length > 200) {
    messages[room] = messages[room].slice(-200);
  }
  
  return message;
};

const getRoomMessages = (room, limit = 50) => {
  if (!messages[room]) return [];
  return messages[room].slice(-limit);
};

const searchMessages = (room, query) => {
  if (!messages[room]) return [];
  
  return messages[room].filter(message => 
    message.content.toLowerCase().includes(query.toLowerCase())
  );
};

export default {
  saveMessage,
  getRoomMessages,
  searchMessages
};