const { db } = require('../firebase');

// Function to create a new notification for a user
const createNotification = async (receiverId, senderId, text, type) => {
  try {
    const receiverRef = db.collection('User').doc(receiverId);
    const senderRef = db.collection('User').doc(senderId);

    const notification = {
      receiver: receiverRef,
      sender: senderRef,
      text,
      timestamp: Date.now(),
      type,
    };

    const notificationRef = await receiverRef.collection('Notifications').add(notification);

    return { message: 'Notification created successfully', notificationId: notificationRef.id };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Internal server error');
  }
};

// Function to get all notifications for a user in order from latest to oldest
const getUserNotifications = async (userId) => {
    try {
      const userRef = db.collection('User').doc(userId);
  
      const notificationsSnapshot = await userRef
        .collection('Notifications')
        .orderBy('timestamp', 'desc')
        .get();
  
      const notifications = [];
      for (let doc of notificationsSnapshot.docs) {
        const notificationData = doc.data();
        // Resolve the sender reference
        const senderData = (await notificationData.sender.get()).data();
  
        notifications.push({
          ...notificationData,
          sender: senderData,  // Replace the sender reference with the actual data
          id: doc.id, // Use the document id as the identifier
        });
      }
  
      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw new Error('Internal server error');
    }
  };

// Function to update a notification
const updateNotification = async (userId, timestamp, updatedFields) => {
    try {
      const userRef = db.collection('User').doc(userId);
  
      const notificationsSnapshot = await userRef
        .collection('Notifications')
        .where('timestamp', '==', timestamp)
        .get();
  
      if (!notificationsSnapshot.empty) {
        notificationsSnapshot.forEach(async (doc) => {
          await doc.ref.update(updatedFields);
        });
  
        return { message: 'Notification updated successfully' };
      } else {
        throw new Error('Notification not found');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new Error('Internal server error');
    }
  };
  

module.exports = { createNotification, getUserNotifications, updateNotification };
