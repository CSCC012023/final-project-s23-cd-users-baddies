const express = require('express');
const router = express.Router();
const { getAllUsers, getUserProfile, updateUserProfile, getBusinessUsers } = require('../controllers/usersController');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get business users
router.get('/business', async (req, res) => {
    try {
      const businessUsers = await getBusinessUsers();
      res.json(businessUsers);
    } catch (error) {
      console.error('Error getting business users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;
    await updateUserProfile(userId, { name, email, password });
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


