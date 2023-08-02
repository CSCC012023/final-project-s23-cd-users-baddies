const { db } = require('../firebase');

// Get all reviews for a business
const getBusinessReviews = async (uid) => {

    try {
        const businessRef = db.collection('User').doc(uid);
        const reviewsRef = db.collection('Reviews');
        const querySnapshot = await reviewsRef.where('businessAccount', '==', businessRef).get();

        const reviews = [];
        querySnapshot.forEach((doc) => {
            const reviewData = doc.data();
            reviews.push(reviewData);
        });

        return reviews;
        } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
        }
}

module.exports = {
    getBusinessReviews
}