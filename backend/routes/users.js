const express = require('express');
const router = express.Router();
const { getAllUsers, getUserProfile, updateUserProfile, getBusinessUsers, getUserServices, getUserClients, deleteUserService, addBusinessUserService, editUserService, upsertUserClient } = require('../controllers/usersController');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get business users
router.get('/businesses', async (req, res) => {
  try {
    const businessUsers = await getBusinessUsers();
    res.json(businessUsers);
  } catch (error) {
    console.error('Error getting business users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get clients of a User
router.get('/clients/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userClients = await getUserClients(userId);
    res.json(userClients);
  } catch (error) {
    console.error('Error getting user clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get services for business users
router.get('/services/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userServices = await getUserServices(userId);
    res.json(userServices);
  } catch (error) {
    console.error('Error getting user services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a service for business account
router.post('/services/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { serviceName, description, price, duration, servicePic} = req.body;

    // Check if the required fields are provided
    if (!serviceName || !description || !price || !duration) {
      return res.status(400).json({ error: 'Service name, description, price and duration are required' });
    }

    const newService = {
      serviceName,
      description,
      price,
      duration,
      servicePic
    };
    console.log(servicePic)

    await addBusinessUserService(userId, newService);

    res.json({ message: 'Service added successfully' });
  } catch (error) {
    console.error('Error adding user service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete service for a user
router.delete('/services/:userId/:serviceId', async (req, res) => {
  try {
    const { userId, serviceId } = req.params;

    // Call the function to delete the service
    await deleteUserService(userId, serviceId);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting user service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Edit service fields
router.put('/services/:userId/:serviceId', async (req, res) => {
  try {
    const { userId, serviceId } = req.params;
    const { serviceName, description, price, duration,} = req.body;

    // Check if the required fields are provided
    if (!serviceName || !description || !price || !duration) {
      return res
        .status(400)
        .json({ error: 'Service name, description, price, and duration are required' });
    }

    const updatedService = {
      serviceName,
      description,
      price,
      duration,
    };

    await editUserService(userId, serviceId, updatedService);

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating user service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfile(userId); // Use userId (which is the UID) to fetch the user profile
    res.json(userProfile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateFields = req.body;
    await updateUserProfile(userId, updateFields);
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/manage-clients/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { clientId, lastDeal } = req.body;

    // Check if the required fields are provided
    if (!clientId || !lastDeal) {
      return res.status(400).json({ error: 'Client ID and last deal timestamp are required' });
    }

    await upsertUserClient(userId, clientId, lastDeal);

    res.json({ message: 'Client managed successfully' });
  } catch (error) {
    console.error('Error managing client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;