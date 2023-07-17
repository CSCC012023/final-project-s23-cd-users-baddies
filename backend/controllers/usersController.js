const { db } = require('../firebase');

// Get all users
const getAllUsers = async () => {
  try {
    const usersRef = db.collection('User');
    const usersSnapshot = await usersRef.get();

    const users = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      users.push(user);
    });

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Internal server error');
  }
};

// Get user profile
const getUserProfile = async (uid) => {
  try {
    const userRef = db.collection('User').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userProfile = userDoc.data();
      return userProfile; // Return the userProfile instead of sending the response directly
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Internal server error');
  }
};

// Get business users
const getBusinessUsers = async () => {
  try {
    const usersRef = db.collection('User');
    const querySnapshot = await usersRef.where('userType', '==', 'business').get();

    const businessUsers = [];
    querySnapshot.forEach((doc) => {
      const businessUser = doc.data();
      businessUsers.push(businessUser);
    });

    return businessUsers;
  } catch (error) {
    console.error('Error getting business users:', error);
    throw new Error('Internal server error');
  }
};


// Update user profile
const updateUserProfile = async (userId, updateFields) => {
  try {
    const userRef = db.collection('User').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update(updateFields);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error; // Re-throw the error to be handled in the route
  }
};

module.exports = { getAllUsers, getUserProfile, updateUserProfile, getBusinessUsers };
