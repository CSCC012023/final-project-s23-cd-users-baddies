const express = require('express');
const app = express();
const cors = require('cors');

// Middleware and configuration setup
// ...
app.use(express.json());
app.use(cors());

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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
