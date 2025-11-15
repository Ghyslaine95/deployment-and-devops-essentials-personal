import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // higher limit for chat app
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Compression
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));

// Socket.io with production config
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false
});

// User management storage
const connectedUsers = new Map();
const roomParticipants = new Map();
const messageHistory = new Map(); // Store message history per room

// Initialize default rooms
roomParticipants.set('general', new Set());
roomParticipants.set('random', new Set());
roomParticipants.set('tech', new Set());
messageHistory.set('general', []);
messageHistory.set('random', []);
messageHistory.set('tech', []);

// Helper functions
function getRoomParticipants(room) {
  if (!roomParticipants.has(room)) return [];
  const participantIds = Array.from(roomParticipants.get(room));
  return participantIds.map(id => {
    const user = connectedUsers.get(id);
    return user ? { id: user.id, username: user.username, isOnline: true } : null;
  }).filter(Boolean);
}

function getAllConnectedUsers() {
  return Array.from(connectedUsers.values()).map(user => ({
    ...user,
    isOnline: true
  }));
}

function getAllRooms() {
  return Array.from(roomParticipants.keys());
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chat server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    connectedClients: io.engine.clientsCount,
    connectedUsers: getAllConnectedUsers(),
    activeRooms: getAllRooms().map(room => ({
      room,
      participantCount: roomParticipants.get(room).size,
      participants: getRoomParticipants(room)
    }))
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user join
  socket.on('user_join', (username) => {
    console.log(`User ${username} joined with socket ID: ${socket.id}`);
    
    // Store user information
    connectedUsers.set(socket.id, {
      id: socket.id,
      username: username,
      room: 'general', // default room
      joinedAt: new Date()
    });

    // Add to default room participants
    roomParticipants.get('general').add(socket.id);
    socket.join('general');

    // Send current room info to the user
    socket.emit('message_history', messageHistory.get('general') || []);
    socket.emit('rooms_list', getAllRooms());
    
    // Notify others in the room
    socket.to('general').emit('user_joined', {
      id: socket.id,
      username: username
    });

    // Update everyone with new user list
    io.emit('user_list', getAllConnectedUsers());

    console.log(`User ${username} joined general room. Total users: ${connectedUsers.size}`);
  });

  // Handle room join
  socket.on('join_room', (roomName) => {
    const user = connectedUsers.get(socket.id);
    if (!user) {
      console.log('No user found for socket:', socket.id);
      return;
    }

    const oldRoom = user.room;
    
    // Leave old room if different
    if (oldRoom !== roomName) {
      // Remove from old room participants
      if (roomParticipants.has(oldRoom)) {
        roomParticipants.get(oldRoom).delete(socket.id);
        // Notify old room
        socket.to(oldRoom).emit('user_left', {
          id: socket.id,
          username: user.username
        });
      }

      // Join new room
      if (!roomParticipants.has(roomName)) {
        roomParticipants.set(roomName, new Set());
        messageHistory.set(roomName, []);
      }
      roomParticipants.get(roomName).add(socket.id);
      
      user.room = roomName;
      socket.leave(oldRoom);
      socket.join(roomName);

      // Send message history for new room
      socket.emit('message_history', messageHistory.get(roomName) || []);

      // Notify new room
      socket.to(roomName).emit('user_joined', {
        id: socket.id,
        username: user.username
      });

      // Update users list for everyone
      io.emit('user_list', getAllConnectedUsers());
      io.emit('rooms_list', getAllRooms());

      console.log(`User ${user.username} moved from #${oldRoom} to #${roomName}`);
    }
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    const user = connectedUsers.get(socket.id);
    console.log('Message received from:', user?.username, 'Content:', data);
    
    if (user && data.content && data.content.trim()) {
      const messageData = {
        id: `${socket.id}-${Date.now()}`,
        username: user.username,
        content: data.content.trim(),
        timestamp: new Date().toISOString(),
        room: user.room
      };
      
      // Add to message history
      const roomHistory = messageHistory.get(user.room) || [];
      roomHistory.push(messageData);
      // Keep only last 100 messages per room
      if (roomHistory.length > 100) {
        roomHistory.shift();
      }
      messageHistory.set(user.room, roomHistory);
      
      // Send to everyone in the room
      io.to(user.room).emit('receive_message', messageData);
      
      console.log(`Message sent to room ${user.room} by ${user.username}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    const user = connectedUsers.get(socket.id);
    console.log(`User disconnected: ${user?.username || socket.id} - Reason: ${reason}`);
    
    if (user) {
      // Remove from room participants
      if (roomParticipants.has(user.room)) {
        roomParticipants.get(user.room).delete(socket.id);
        // Notify room
        socket.to(user.room).emit('user_left', {
          id: socket.id,
          username: user.username
        });
      }
      
      // Remove user from connected users
      connectedUsers.delete(socket.id);
      
      // Update users list for everyone
      io.emit('user_list', getAllConnectedUsers());
      
      console.log(`User ${user.username} removed. Remaining users: ${connectedUsers.size}`);
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  io.close(() => {
    console.log('Socket.IO server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🏠 Available rooms: general, random, tech`);
});

export { app, io };