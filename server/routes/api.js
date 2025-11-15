import express from 'express';
import messageController from '../controllers/messageController.js';
import roomController from '../controllers/roomController.js';

const router = express.Router();

// Get messages for a room
router.get('/messages/:room', (req, res) => {
  const { room } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  const messages = messageController.getRoomMessages(room)
    .slice(-limit - offset, -offset || undefined);
  
  res.json({
    room,
    messages,
    total: messageController.getRoomMessages(room).length
  });
});

// Search messages in a room
router.get('/messages/:room/search', (req, res) => {
  const { room } = req.params;
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  const results = messageController.searchMessages(room, q);
  res.json({ room, query: q, results });
});

// Get all rooms
router.get('/rooms', (req, res) => {
  const rooms = roomController.getAllRooms();
  res.json(rooms);
});

// Create new room
router.post('/rooms', (req, res) => {
  const { name, description } = req.body;
  
  try {
    const room = roomController.createRoom(name, description);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export nommé
export { router as apiRoutes };