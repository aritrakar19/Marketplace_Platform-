require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const app = require('./app');
const { initSocket } = require('./utils/socket');

const PORT = 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB
connectDB().then(() => {
  server.listen(PORT, () => console.log('Server running on port ' + PORT));
});