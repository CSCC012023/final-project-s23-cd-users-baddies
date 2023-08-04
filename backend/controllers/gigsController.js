const { db } = require('../firebase');
const firebase = require('firebase-admin');


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
      const gigDocRef = await gigsRef.add(gigData);
  
      // Get the generated ID of the newly created gig
      const gid = gigDocRef.id;
  
      // Update the gig document with the gid field
      await gigDocRef.update({ gid });
  
      return { message: 'Gig created successfully', gid: gid };
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
      // Update the user's Gigs array in the Users collection
      await db.collection('User').doc(uid).update({
        Gigs: firebase.firestore.FieldValue.arrayRemove(db.collection('Gigs').doc(gid)),
      });
  
      // Delete the gig from the Gigs collection
      await db.collection('Gigs').doc(gid).delete();
  
      return { message: 'Gig deleted successfully' };
    } catch (error) {
      console.error('Error deleting gig:', error);
      throw new Error('Internal server error');
    }
};

  
  

  const checkIfPostRequestedByUser = async (uid, pid) => {
    try {
      const gigsRef = db.collection('Gigs');
      const querySnapshot = await gigsRef
        .where('business', '==', db.doc(`User/${uid}`))
        .where('post', '==', db.doc(`Posts/${pid}`))
        .where('status', '==', 'requested')
        .get();
  
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if post is requested by user:', error);
      throw new Error('Internal server error');
    }
  };

module.exports = { getUserGigs, createGig, updateGigStatus, deleteGig, checkIfPostRequestedByUser };


