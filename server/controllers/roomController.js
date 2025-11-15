const rooms = new Map([
  ['general', { name: 'general', description: 'General discussions', createdAt: new Date() }],
  ['random', { name: 'random', description: 'Random talks', createdAt: new Date() }],
  ['tech', { name: 'tech', description: 'Technology discussions', createdAt: new Date() }]
]);

const userRooms = new Map(); // socketId -> Set of room names

const createRoom = (name, description = '') => {
  if (rooms.has(name)) {
    throw new Error('Room already exists');
  }
  
  const room = {
    name,
    description,
    createdAt: new Date(),
    userCount: 0
  };
  
  rooms.set(name, room);
  return room;
};

const getAllRooms = () => {
  return Array.from(rooms.values());
};

const joinRoom = (socketId, roomName) => {
  if (!rooms.has(roomName)) {
    throw new Error('Room does not exist');
  }
  
  if (!userRooms.has(socketId)) {
    userRooms.set(socketId, new Set());
  }
  
  userRooms.get(socketId).add(roomName);
  rooms.get(roomName).userCount = (rooms.get(roomName).userCount || 0) + 1;
  
  return rooms.get(roomName);
};

const leaveRoom = (socketId, roomName) => {
  if (userRooms.has(socketId)) {
    userRooms.get(socketId).delete(roomName);
  }
  
  if (rooms.has(roomName) && rooms.get(roomName).userCount > 0) {
    rooms.get(roomName).userCount--;
  }
};

const getUserRooms = (socketId) => {
  return userRooms.has(socketId) ? Array.from(userRooms.get(socketId)) : [];
};

const getRoomUsers = (roomName) => {
  const usersInRoom = [];
  
  for (const [socketId, roomsSet] of userRooms.entries()) {
    if (roomsSet.has(roomName)) {
      usersInRoom.push(socketId);
    }
  }
  
  return usersInRoom;
};

export default {
  createRoom,
  getAllRooms,
  joinRoom,
  leaveRoom,
  getUserRooms,
  getRoomUsers
};