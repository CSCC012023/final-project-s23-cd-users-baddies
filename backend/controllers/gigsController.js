const { db } = require('../firebase');

// Function to retrieve gigs for a user by UID
const getUserGigs = async (uid) => {
  try {
    const gigsRef = db.collection('Gigs');
    const querySnapshot = await gigsRef.where('business', '==', db.doc(`User/${uid}`)).get();

    const gigs = [];
    querySnapshot.forEach((doc) => {
      gigs.push(doc.data());
    });

    return gigs;
  } catch (error) {
    console.error('Error retrieving user gigs:', error);
    throw new Error('Internal server error');
  }
};

// Function to create a new gig for a user
const createGig = async (uid, pid) => {
  try {
    // Create a new gig in the Gigs collection
    const gigData = {
      business: db.doc(`User/${uid}`),
      post: db.doc(`Posts/${pid}`),
      status: 'requested', // Set the initial status to 'requested'
    };

    const gigsRef = db.collection('Gigs');
    await gigsRef.add(gigData);

    return { message: 'Gig created successfully' };
  } catch (error) {
    console.error('Error creating gig:', error);
    throw new Error('Internal server error');
  }
};

const updateGigStatus = async (gid, newStatus) => {
    try {
      // Update the status field in the gig document
      await db.collection('Gigs').doc(gid).update({ status: newStatus });
  
      return { message: 'Gig status updated successfully' };
    } catch (error) {
      console.error('Error updating gig status:', error);
      throw new Error('Internal server error');
    }
  };
  
  // Function to delete a gig
  const deleteGig = async (gid, uid) => {
    try {
      // Delete the gig from the Gigs collection
      await db.collection('Gigs').doc(gid).delete();
  
      // Update the user's Gigs array in the Users collection
      await db.collection('User').doc(uid).update({
        Gigs: firebase.firestore.FieldValue.arrayRemove(db.collection('Gigs').doc(gid)),
      });
  
      return { message: 'Gig deleted successfully' };
    } catch (error) {
      console.error('Error deleting gig:', error);
      throw new Error('Internal server error');
    }
  };

module.exports = { getUserGigs, createGig, updateGigStatus, deleteGig };


