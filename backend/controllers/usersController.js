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

const getUserClients = async (userId) => {
  try {
    const userRef = db.collection('User').doc(userId).collection('PastClients');
    const clientsSnapshot = await userRef.get();
    const clients = [];

    clientsSnapshot.forEach((doc) => {
      const client = doc.data();
      clients.push(client);
    });

    return clients;
  } catch (error) {
    console.error('Error getting user clients:', error);
    throw new Error('Internal server error');
  }
};

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

// Delete a service for a user
const deleteUserService = async (userId, serviceId) => {
  try {
    // Get the service document reference
    const serviceRef = db.collection('User').doc(userId).collection('Services').doc(serviceId);

    // Check if the service exists
    const serviceDoc = await serviceRef.get();
    if (!serviceDoc.exists) {
      throw new Error('Service not found');
    }

    // Delete the service document
    await serviceRef.delete();

  } catch (error) {
    console.error('Error deleting user service:', error);
    throw error; // Re-throw the error to be handled in the route
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

const upsertUserClient = async (userId, clientId, lastDeal) => {
  try {
    const userRef = db.collection('User').doc(userId);
    const pastClientsRef = userRef.collection('PastClients');
    const clientRef = db.collection('User').doc(clientId); // client reference

    // Query to find if the client already exists
    const querySnapshot = await pastClientsRef.where('client', '==', clientRef).get();
    
    if (!querySnapshot.empty) {
      // Client found, update the 'lastDeal' field
      const docRef = querySnapshot.docs[0].ref; // get document reference of the client
      await docRef.update({ lastDeal });
    } else {
      // Client not found, create new document
      await pastClientsRef.add({ client: clientRef, lastDeal });
    }
  } catch (error) {
    console.error('Error upserting user client:', error);
    throw error; // Re-throw the error to be handled in the route
  }
};


module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getBusinessUsers,
  getUserServices,
  getUserClients,
  addBusinessUserService,
  editUserService,
  deleteUserService,
  upsertUserClient
};
