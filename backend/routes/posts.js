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
      price: parseFloat(price), // Convert to a number
      location: {
        lat: parseFloat(location.lat), // Convert to a number
        lon: parseFloat(location.lon) // Convert to a number
      },
      postalCode,
      postedBy: `/User/${uid}`, // Reference to the user who created the post
      status: 'posted',
      pid: Date.now().toString() // Use a string representation for pid field (for consistency with Firestore)
    };

    const result = await postsController.createPost(uid, newPost, req.app.get('io')); // Pass req.app.get('io')


    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    const allPosts = await postsController.getAllPosts();
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a post
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;

  try {
    const result = await postsController.updatePost(pid, updatedFields);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


