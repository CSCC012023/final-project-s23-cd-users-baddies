const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Route to retrieve user data by UID
router.get('/users/:uid', async (req, res) => {
    const { uid } = req.params;
  
    try {
      const docRef = db.collection('Users').doc(uid);
      const docSnap = await docRef.get();
  
      if (docSnap.exists) {
        const userData = docSnap.data();
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route to retrieve posts of a user by UID
  router.get('/users/:uid/posts', async (req, res) => {
    const { uid } = req.params;
  
    try {
      const docRef = db.collection('Users').doc(uid);
      const docSnap = await docRef.get();
  
      if (docSnap.exists) {
        const userData = docSnap.data();
        const posts = userData.posts || []; // Assuming posts field is an array in the user document
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error retrieving user posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route to create a new post for a user
router.post('/users/:uid/posts', async (req, res) => {
    const { uid } = req.params;
    const { title, description, price, location, postalCode } = req.body;
  
    try {
      const docRef = db.collection('Users').doc(uid);
      const docSnap = await docRef.get();
  
      if (docSnap.exists) {
        const userData = docSnap.data();
        const newPost = {
          title,
          description,
          price,
          location,
          postalCode,
          postedBy: uid,
        };
  
        if (!userData.posts) {
          userData.posts = [];
        }
        userData.posts.push(newPost);
  
        await docRef.update({ posts: userData.posts });
  
        res.status(200).json({ message: 'Post created successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



// Define more routes as needed

module.exports = router;
