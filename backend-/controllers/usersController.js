const { db } = require('../firebase');

// Get all users
const getAllUsers = async () => {
  try {
    const usersRef = db.collection('Users');
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
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Logic to fetch user profile from the database based on the userId
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userProfile = userDoc.data();
      res.json(userProfile);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get business users
const getBusinessUsers = async () => {
  try {
    const usersRef = db.collection('Users');
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
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    // Logic to update user profile in the database based on the userId
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({ name, email, password });
      res.json({ message: 'User profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllUsers, getUserProfile, updateUserProfile, getBusinessUsers };
