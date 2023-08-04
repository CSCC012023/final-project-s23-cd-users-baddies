const { db } = require('../firebase');
const { Server } = require('socket.io');
const http = require('http');
const { server } = require('../app'); // Import the server instance from app.js
const io = new Server(server); // Initialize Socket.io with the server instance



// Function to get all messages between two users
const getMessagesBetweenUsers = async (user1Id, user2Id) => {
  try {
    // Reference to the chats sub-collection for user1
    const user1ChatsRef = db.collection('User').doc(user1Id).collection('Chats');

    // Get all chat documents for user1
    const user1ChatsSnapshot = await user1ChatsRef.get();

    // Array to store all messages between the users
    let messages = [];

    // Iterate through each chat document
    for (const chatDoc of user1ChatsSnapshot.docs) {
      // Check if the chat document is between user1 and user2
      const chatData = chatDoc.data();
      const chatWithRef = chatData.chatWith;

      // Extract the user ID from the chatWith reference
      const chatWithUserId = chatWithRef.id;

      if (chatWithUserId === user2Id) {
        // Reference to the messages collection within the chat
        const messagesRef = chatDoc.ref.collection('Messages');

        // Query all messages within the chat ordered by timestamp
        const messagesSnapshot = await messagesRef.orderBy('timestamp', 'asc').get();

        // Iterate through each message document in the Messages sub-collection
        messagesSnapshot.docs.forEach((doc) => {
          const messageData = doc.data();
          messages.push({
            text: messageData.text,
            sender: messageData.sender,
            receiver: messageData.receiver,
            timestamp: messageData.timestamp,
            isCurrentUser: messageData.sender === user1Id,
            // Include any other message data you want to retrieve
          });
        });
      }
    }

    // Sort all messages by timestamp before returning them
    messages.sort((a, b) => a.timestamp - b.timestamp);

    return messages;
  } catch (error) {
    console.error('Error getting messages between users:', error);
    throw new Error('Internal server error');
  }
};








// Function to send a message from one user to another
const sendMessage = async (senderId, receiverId, text, io) => {
  try {
    // Get references to the sender and receiver user documents
    const senderRef = db.collection('User').doc(senderId);
    const receiverRef = db.collection('User').doc(receiverId);

    // Check if a chat exists between the sender and receiver for the sender
    const senderChatSnapshot = await senderRef.collection('Chats').where('chatWith', '==', receiverRef).get();

    // Check if a chat exists between the sender and receiver for the receiver
    const receiverChatSnapshot = await receiverRef.collection('Chats').where('chatWith', '==', senderRef).get();

    let senderChatId;
    let senderChatRef;
    let receiverChatId;
    let receiverChatRef;

    // Check if the chat exists for the sender
    if (!senderChatSnapshot.empty) {
      const chatDoc = senderChatSnapshot.docs[0];
      senderChatId = chatDoc.id;
      senderChatRef = chatDoc.ref;
    } else {
      // Create a new chat if no chat exists between the users for the sender
      const newSenderChatRef = senderRef.collection('Chats').doc();
      await newSenderChatRef.set({
        chatWith: receiverRef,
        lastMessageTime: Date.now(), // Set the lastMessageTime to the current server timestamp
        // Other chat data...
      });
      senderChatId = newSenderChatRef.id;
      senderChatRef = newSenderChatRef;
    }

    // Check if the chat exists for the receiver
    if (!receiverChatSnapshot.empty) {
      const chatDoc = receiverChatSnapshot.docs[0];
      receiverChatId = chatDoc.id;
      receiverChatRef = chatDoc.ref;
    } else {
      // Create a new chat if no chat exists between the users for the receiver
      const newReceiverChatRef = receiverRef.collection('Chats').doc();
      await newReceiverChatRef.set({
        chatWith: senderRef,
        lastMessageTime: Date.now(), // Set the lastMessageTime to the current server timestamp
        // Other chat data...
      });
      receiverChatId = newReceiverChatRef.id;
      receiverChatRef = newReceiverChatRef;
    }

    // Add the message to the Messages sub-collection of the chat for the sender
    const timestamp = Date.now();

    await senderChatRef.collection('Messages').add({
      text: text,
      sender: senderRef,
      receiver: receiverRef,
      timestamp: timestamp,
      // Other message data...
    });

    // Add the message to the Messages sub-collection of the chat for the receiver
    await receiverChatRef.collection('Messages').add({
      text: text,
      sender: senderRef,
      receiver: receiverRef,
      timestamp: timestamp,
      // Other message data...
    });

    io.emit('newMessage', { senderId, receiverId, text });

    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Internal server error');
  }
};













// Function to get all the people the user has chats with in order from most recent to oldest
const getChatContacts = async (uid) => {
  try {
    const chatContacts = [];

    // Get reference to the user's chats collection
    const userChatsRef = db.collection('User').doc(uid).collection('Chats');

    // Query all chat documents ordered by timestamp in descending order
    const chatSnapshot = await userChatsRef.get();

    // Iterate through each chat document and extract the chatWith user data
    for (const chatDoc of chatSnapshot.docs) {
      const chatData = chatDoc.data();
      const chatWithRef = chatData.chatWith;

      // Get the user ID from the chatWith reference
      const chatWithUserId = chatWithRef.id;

      // Get the chatWith user data from the Users collection
      const chatWithUserSnapshot = await chatWithRef.get();
      const chatWithUserData = chatWithUserSnapshot.data();

      // Get the name of the chatWith user
      const chatWithUserName = chatWithUserData.Name; // Replace 'Name' with the actual field that stores the user's name in your database
      const chatWithPic = chatWithUserData.profilePicture;
      // Add the chatWith user ID and name to the chatContacts array
      chatContacts.push({ userId: chatWithUserId, name: chatWithUserName, profilePicture: chatWithPic });
    }

    return chatContacts;
  } catch (error) {
    console.error('Error getting chat contacts:', error);
    throw new Error('Internal server error');

  }
};







module.exports = { getMessagesBetweenUsers, sendMessage, getChatContacts};


