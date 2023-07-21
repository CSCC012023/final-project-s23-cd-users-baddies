const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for Google sign-in
router.post('/googleSignIn', authController.signInWithGoogle);
// Route for user registration
router.post('/registerprocess', authController.registerProcess);

module.exports = router;
