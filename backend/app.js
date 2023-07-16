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
app.use('/api/posts', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auths', authRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
