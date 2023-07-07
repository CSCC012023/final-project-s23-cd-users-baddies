const express = require('express');
const router = express.Router();

const { getAllUsers, getUserProfile, updateUserProfile } = require('../controllers/userController');

// Get all users
router.get('/users', getAllUsers);

// Get user profile
router.get('/profile/:userId', getUserProfile);

// Update user profile
router.put('/profile/:userId', updateUserProfile);

module.exports = router;

