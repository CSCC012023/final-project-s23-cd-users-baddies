const express = require('express');
const { getBusinessReviews } = require('../controllers/reviewController');
const router = express.Router();

// GET business reviews
router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
  
    try {
      const reviews = await getBusinessReviews(uid);
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
  });
  
  module.exports = router;
