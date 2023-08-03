const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

// Route to create a new notification
router.post('/create', async (req, res) => {
    const { receiverId, senderId, text, type, gigId, postId } = req.body;

    try {
        const result = await notificationsController.createNotification(receiverId, senderId, text, type, gigId, postId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all notifications for a user in order from latest to oldest
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await notificationsController.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a notification
router.put('/:userId/:timestamp', async (req, res) => {
    const { userId, timestamp } = req.params;
    const updatedFields = req.body;
  
    try {
      const result = await notificationsController.updateNotification(userId, Number(timestamp), updatedFields);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
