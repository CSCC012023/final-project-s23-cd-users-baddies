const { db, firebase } = require('../firebase');

// Function to create a new gig
const createGig = async (postId, businessId) => {
  try {
    // Create a new gig in the Gigs collection
    const gigData = {
      post: db.collection('Posts').doc(postId),
      business: db.collection('Users').doc(businessId),
      status: 'requested', // Set the initial status to 'requested'
    };

    const gigRef = await db.collection('Gigs').add(gigData);

    // Update the user's Gigs array in the Users collection
    await db.collection('Users').doc(businessId).update({
      Gigs: firebase.firestore.FieldValue.arrayUnion(gigRef),
    });

    return { message: 'Gig created successfully' };
  } catch (error) {
    console.error('Error creating gig:', error);
    throw new Error('Internal server error');
  }
};

// Function to update the status of a gig
const updateGigStatus = async (gigId, newStatus) => {
  try {
    // Update the status field in the gig document
    await db.collection('Gigs').doc(gigId).update({ status: newStatus });

    return { message: 'Gig status updated successfully' };
  } catch (error) {
    console.error('Error updating gig status:', error);
    throw new Error('Internal server error');
  }
};

// Function to get all gigs for a specific user (business)
const getUserGigs = async (businessId) => {
  try {
    // Get all gigs where the business field matches the businessId
    const gigsSnapshot = await db.collection('Gigs').where('business', '==', db.collection('Users').doc(businessId)).get();

    const gigs = [];
    gigsSnapshot.forEach((doc) => {
      const gig = doc.data();
      gigs.push(gig);
    });

    return gigs;
  } catch (error) {
    console.error('Error getting user gigs:', error);
    throw new Error('Internal server error');
  }
};

// Function to delete a gig
const deleteGig = async (gigId, businessId) => {
  try {
    // Delete the gig from the Gigs collection
    await db.collection('Gigs').doc(gigId).delete();

    // Update the user's Gigs array in the Users collection
    await db.collection('Users').doc(businessId).update({
      Gigs: firebase.firestore.FieldValue.arrayRemove(db.collection('Gigs').doc(gigId)),
    });

    return { message: 'Gig deleted successfully' };
  } catch (error) {
    console.error('Error deleting gig:', error);
    throw new Error('Internal server error');
  }
};

module.exports = { createGig, updateGigStatus, getUserGigs, deleteGig };
