const { db, firebaseAdmin } = require('../firebase');

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

// Create a review
const createReview = async (businessAccount, customerAccount, review) => {
    try {
        const businessRef = db.collection('User').doc(businessAccount);
        const customerRef = db.collection('User').doc(customerAccount);
        review.businessAccount = businessRef;
        review.customerAccount = customerRef;
        review.createdAt = firebaseAdmin.firestore.FieldValue.serverTimestamp();

        const reviewRef = await db.collection('Reviews').add(review);
        return reviewRef.id;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

module.exports = {
    getBusinessReviews, createReview
}