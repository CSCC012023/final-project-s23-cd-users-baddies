const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Route to retrieve posts of a user by UID
router.get('/users/:uid/posts', async (req, res) => {
  const { uid } = req.params;

  try {
    const posts = await postsController.getUserPosts(uid);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new post for a user
router.post('/users/:uid/posts', async (req, res) => {
  const { uid } = req.params;
  const { title, description, price, location, postalCode } = req.body;

  try {
    const newPost = {
      title,
      description,
      price,
      location,
      postalCode,
    };

    const result = await postsController.createPost(uid, newPost);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define more routes as needed

module.exports = router;

