const express = require('express');
const app = express();
const cors = require('cors');

// Middleware and configuration setup
// ...
app.use(express.json());
app.use(cors());

// Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
