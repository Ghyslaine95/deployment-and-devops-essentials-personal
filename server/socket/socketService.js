import { setupSocketHandlers } from './eventHandlers.js';

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    setupSocketHandlers(io, socket);
  });

  // Periodic cleanup of typing indicators
  setInterval(() => {
    // Could add cleanup logic here for stale typing indicators
  }, 10000);
};

export { initializeSocket };