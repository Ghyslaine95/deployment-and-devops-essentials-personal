import authController from '../controllers/authController.js';

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (token) {
    const decoded = authController.verifyToken(token);
    if (decoded) {
      socket.user = decoded;
      return next();
    }
  }
  
  // For now, allow connection without auth (username-based)
  next();
};

export { socketAuthMiddleware };