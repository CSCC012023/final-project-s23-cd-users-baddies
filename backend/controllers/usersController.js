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

// usersController.js

// ...

// Get services for a specific user
const getUserServices = async (userId) => {
  try {
    const userRef = db.collection('User').doc(userId).collection('Services');
    const servicesSnapshot = await userRef.get();
    const services = [];
    servicesSnapshot.forEach((doc) => {
      const service = doc.data();
      services.push(service);
    });

    return services;
  } catch (error) {
    console.error('Error getting user services:', error);
    throw new Error('Internal server error');
  }
};

// Add a service for a user
const addBusinessUserService = async (userId, newService) => {
  try {
    // Get the user document reference
    const userRef = db.collection('User').doc(userId);

    // Check if the user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    // Add the service document to the "Services" subcollection and let Firestore generate the document ID
    const servicesCollectionRef = userRef.collection('Services');
    const serviceDocRef = await servicesCollectionRef.add(newService);

    // Get the generated service ID and update the service document with it
    const serviceId = serviceDocRef.id;
    await serviceDocRef.update({ serviceId });

  } catch (error) {
    console.error('Error adding user service:', error);
    throw error; // Re-throw the error to be handled in the route
  }
};

// Update a service
const editUserService = async (userId, serviceId, updatedService) => {
  try {
    // Get the service document reference
    const serviceRef = db.collection('User').doc(userId).collection('Services').doc(serviceId);

    // Check if the service exists
    const serviceDoc = await serviceRef.get();
    if (!serviceDoc.exists) {
      throw new Error('Service not found');
    }

    // Update the service document with the provided updatedService fields
    await serviceRef.update(updatedService);

  } catch (error) {
    console.error('Error updating user service:', error);
    throw error; // Re-throw the error to be handled in the route
  }
};

module.exports = { 
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getBusinessUsers,
  getUserServices,
  addBusinessUserService,
  editUserService
};
