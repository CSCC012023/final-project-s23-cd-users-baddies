const express = require('express');
const router = express.Router();
const { getMessagesBetweenUsers, sendMessage, getChatContacts } = require('../controllers/messagesController');

// Route to get all messages between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const messages = await getMessagesBetweenUsers(user1Id, user2Id);
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to send a message from one user to another
router.post('/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const { text } = req.body;

    const result = await sendMessage(senderId, receiverId, text);
    res.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all the people the user has chats with in order from most recent to oldest
router.get('/contacts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const chatContacts = await getChatContacts(userId);
    res.json(chatContacts);
  } catch (error) {
    console.error('Error getting chat contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
