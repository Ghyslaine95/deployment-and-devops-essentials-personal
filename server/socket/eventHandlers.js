import authController from '../controllers/authController.js';
import messageController from '../controllers/messageController.js';
import roomController from '../controllers/roomController.js';

const typingUsers = new Map();

const setupSocketHandlers = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  // Authentication handler
  socket.on('user_join', (username) => {
    try {
      const user = authController.registerUser(username, socket.id);
      roomController.joinRoom(socket.id, 'general');
      socket.join('general');

      // Notify all clients
      io.emit('user_list', authController.getAllUsers());
      io.emit('user_joined', { username, id: socket.id });
      
      // Send initial data to the new user
      socket.emit('rooms_list', roomController.getAllRooms());
      socket.emit('message_history', messageController.getRoomMessages('general'));
      
      console.log(`${username} joined the chat`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Message handlers
  socket.on('send_message', (messageData) => {
    try {
      const user = authController.getUser(socket.id);
      if (!user) return;

      const message = {
        id: Date.now().toString(),
        username: user.username,
        userId: socket.id,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        room: user.currentRoom,
        type: 'text'
      };

      const savedMessage = messageController.saveMessage(user.currentRoom, message);
      io.to(user.currentRoom).emit('receive_message', savedMessage);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = authController.getUser(socket.id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();

      // Leave all rooms
      const userRooms = roomController.getUserRooms(socket.id);
      userRooms.forEach(room => {
        roomController.leaveRoom(socket.id, room);
      });

      io.emit('user_left', { username: user.username, id: socket.id });
      
      // Remove user after delay
      setTimeout(() => {
        authController.removeUser(socket.id);
        io.emit('user_list', authController.getAllUsers());
      }, 5000);
    }

    typingUsers.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
};

export { setupSocketHandlers };