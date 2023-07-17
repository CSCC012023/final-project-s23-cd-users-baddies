const express = require('express');
const router = express.Router();
const gigsController = require('../controllers/gigsController');

// Route to create a new gig
router.post('/', async (req, res) => {
  try {
    const { postId, businessId } = req.body;
    const result = await gigsController.createGig(postId, businessId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update the status of a gig
router.put('/:gigId', async (req, res) => {
  try {
    const { gigId } = req.params;
    const { newStatus } = req.body;
    const result = await gigsController.updateGigStatus(gigId, newStatus);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all gigs for a specific user (business)
router.get('/user/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const gigs = await gigsController.getUserGigs(businessId);
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a gig
router.delete('/:gigId/:businessId', async (req, res) => {
  try {
    const { gigId, businessId } = req.params;
    const result = await gigsController.deleteGig(gigId, businessId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
