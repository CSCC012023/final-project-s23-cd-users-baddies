const { db } = require('../firebase');

// Function to get all messages between two users
const getMessagesBetweenUsers = async (user1Id, user2Id) => {
  try {
    const user1Ref = db.collection('Users').doc(user1Id);
    const user2Ref = db.collection('Users').doc(user2Id);

    // Create a query to get messages sent between user1 and user2
    const messagesQuery = db.collection('Messages')
      .where('sender', 'in', [user1Ref, user2Ref])
      .where('receiver', 'in', [user1Ref, user2Ref])
      .orderBy('timestamp', 'asc');

    const messagesSnapshot = await messagesQuery.get();

    const messages = [];
    messagesSnapshot.forEach((doc) => {
      const message = doc.data();
      messages.push(message);
    });

    return messages;
  } catch (error) {
    console.error('Error getting messages between users:', error);
    throw new Error('Internal server error');
  }
};

// Function to send a message from one user to another
const sendMessage = async (senderId, receiverId, text) => {
  try {
    const senderRef = db.collection('Users').doc(senderId);
    const receiverRef = db.collection('Users').doc(receiverId);

    const message = {
      sender: senderRef,
      receiver: receiverRef,
      text,
      timestamp: Date.now(),
    };

    await db.collection('Messages').add(message);

    return { message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Internal server error');
  }
};

// Function to get all the people the user has chats with in order from most recent to oldest
const getChatContacts = async (userId) => {
  try {
    const userRef = db.collection('Users').doc(userId);

    // Get all messages sent or received by the user
    const messagesSnapshot = await userRef.collection('Messages').orderBy('timestamp', 'desc').get();

    const chatContactsMap = new Map();
    messagesSnapshot.forEach((doc) => {
      const message = doc.data();
      const senderId = message.sender.id; // Assuming you stored the user IDs in the 'id' field

      // Exclude the current user from the chat contacts list
      if (senderId !== userId) {
        const timestamp = message.timestamp;
        const existingContact = chatContactsMap.get(senderId);

        // Update the chat contact with the most recent timestamp if it exists
        if (existingContact) {
          existingContact.timestamp = Math.max(existingContact.timestamp, timestamp);
        } else {
          chatContactsMap.set(senderId, {
            userId: senderId,
            timestamp,
          });
        }
      }
    });

    // Sort the chat contacts by timestamp (from most recent to oldest)
    const chatContacts = Array.from(chatContactsMap.values()).sort((a, b) => b.timestamp - a.timestamp);

    return chatContacts;
  } catch (error) {
    console.error('Error getting chat contacts:', error);
    throw new Error('Internal server error');
  }
};

module.exports = { getMessagesBetweenUsers, sendMessage, getChatContacts };

