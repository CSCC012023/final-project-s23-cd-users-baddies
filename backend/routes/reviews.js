const express = require('express');
const { getBusinessReviews, createReview } = require('../controllers/reviewController');
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

// Post create review
  router.post('/:businessAccount/:customerAccount', async (req, res) => {
    const { businessAccount, customerAccount } = req.params;
    const review = req.body;

    try {
        const newReviewId = await createReview(businessAccount, customerAccount, review);
        res.status(201).json({ newReviewId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review.' });
    }
  });
  
  module.exports = router;
