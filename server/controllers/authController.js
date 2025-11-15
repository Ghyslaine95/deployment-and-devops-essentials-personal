import jwt from 'jsonwebtoken';

const users = new Map();

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET || 'chat-secret', {
    expiresIn: '24h'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'chat-secret');
  } catch (error) {
    return null;
  }
};

const registerUser = (username, socketId) => {
  const user = {
    id: socketId,
    username,
    isOnline: true,
    lastSeen: new Date(),
    currentRoom: 'general',
    joinedAt: new Date()
  };
  
  users.set(socketId, user);
  return user;
};

const removeUser = (socketId) => {
  users.delete(socketId);
};

const getUser = (socketId) => {
  return users.get(socketId);
};

const getAllUsers = () => {
  return Array.from(users.values());
};

const updateUserRoom = (socketId, room) => {
  const user = users.get(socketId);
  if (user) {
    user.currentRoom = room;
    return user;
  }
  return null;
};

export default {
  generateToken,
  verifyToken,
  registerUser,
  removeUser,
  getUser,
  getAllUsers,
  updateUserRoom
};