const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Middleware and configuration setup
// ...
app.use(express.json());
app.use(cors());

const server = http.createServer(app)

const io = new Server( server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Routes
const postRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const gigsRoutes = require('./routes/gigs');
app.use('/api/posts', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auths', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/gigs', gigsRoutes);

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('A client connected!');

  // Here you can listen to custom events from the client and respond accordingly.
  // For example, you can listen for 'newPost' event from the client when a new post is created,
  // and then emit an event to all connected clients to inform them about the new post.
  // We'll implement this in the controller section.

  // Disconnect event handling
  socket.on('disconnect', () => {
    console.log('A client disconnected!');
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { server, io }; // Export 'server' and 'io'

