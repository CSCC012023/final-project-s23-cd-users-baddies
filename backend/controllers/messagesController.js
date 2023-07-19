const { db } = require('../firebase');

// Function to get all messages between two users
const getMessagesBetweenUsers = async (user1Id, user2Id) => {
  try {
    const user1Ref = db.collection('User').doc(user1Id);
    const user2Ref = db.collection('User').doc(user2Id);

    // Create a query to get messages sent between user1 and user2
    const messagesQuery = db.collection('User')
      .doc(user1Id)
      .collection('Messages')
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
const sendMessage = async (senderId, receiverId, text, type) => {
    try {
      const senderRef = db.collection('User').doc(senderId);
      const receiverRef = db.collection('User').doc(receiverId);
        
      const message = {
        sender: senderRef,
        receiver: receiverRef,
        text,
        timestamp: Date.now(),
      };
  
      // Add the message to the sender's messages collection
      await senderRef.collection('Messages').add(message);
  
      // Add the same message to the receiver's messages collection
      await receiverRef.collection('Messages').add(message);
  
      return { message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Internal server error');
    }
  };

// Function to get all the people the user has chats with in order from most recent to oldest
const getChatContacts = async (uid) => {
    try {
      if (!uid) {
        throw new Error('User ID is missing.');
      }
  
      const userRef = db.collection('User').doc(uid);
      console.log('User Reference:', userRef.path);
  
      // Get all messages sent or received by the user
      const messagesSnapshot = await userRef.collection('Messages').orderBy('timestamp', 'desc').get();
      console.log('Messages:', messagesSnapshot.size);
  
      const chatContactsMap = new Map();
      messagesSnapshot.forEach((doc) => {
        const message = doc.data();
        const senderId = message.sender; // Assuming you stored the user IDs in the 'id' field
  
        // Exclude the current user from the chat contacts list
        if (senderId !== uid) {
          const timestamp = message.timestamp;
          const existingContact = chatContactsMap.get(senderId);
  
          // Update the chat contact with the most recent timestamp if it exists
          if (existingContact) {
            existingContact.timestamp = Math.max(existingContact.timestamp, timestamp);
          } else {
            chatContactsMap.set(senderId, {
              uid: senderId,
              timestamp,
            });
          }
        }
      });
  
      // Sort the chat contacts by timestamp (from most recent to oldest)
      const chatContacts = Array.from(chatContactsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  
      console.log('Chat Contacts:', chatContacts);
  
      return chatContacts;
    } catch (error) {
      console.error('Error getting chat contacts:', error);
      throw new Error('Internal server error');
    }
};

module.exports = { getMessagesBetweenUsers, sendMessage, getChatContacts };


