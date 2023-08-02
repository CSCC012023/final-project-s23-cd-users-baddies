const express = require('express');
const router = express.Router();
const gigsController = require('../controllers/gigsController');

// Route to retrieve gigs for a user by UID
router.get('/users/:uid/gigs', async (req, res) => {
  const { uid } = req.params;

  try {
    const gigs = await gigsController.getUserGigs(uid);
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new gig for a user
router.post('/users/:uid/gigs', async (req, res) => {
  const { uid } = req.params;
  const { pid } = req.body;

  try {
    const result = await gigsController.createGig(uid, pid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update the status of a gig
router.put('/:gid', async (req, res) => {
    try {
      const { gid } = req.params;
      const { newStatus } = req.body;
      const result = await gigsController.updateGigStatus(gid, newStatus);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
  // Route to delete a gig
router.delete('/:gid/:uid', async (req, res) => {
    try {
      const { gid, uid } = req.params;
      const result = await gigsController.deleteGig(gid, uid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Route to check if the post is requested by the user
router.get('/users/:uid/checkIfPostRequested/:pid', async (req, res) => {
    const { uid, pid } = req.params;
  
    try {
      const isPostRequested = await gigsController.checkIfPostRequestedByUser(uid, pid);
      res.status(200).json({ isPostRequested });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;

