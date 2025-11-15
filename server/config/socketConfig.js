module.exports = {
  corsOptions: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionOptions: {
    pingTimeout: 60000,
    pingInterval: 25000
  }
};