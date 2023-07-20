const { db, io } = require('../firebase');

// Function to retrieve posts of a user by UID
const getUserPosts = async (uid) => {
  try {
    const postsRef = db.collection('Posts');
    const querySnapshot = await postsRef.where('postedBy', '==', db.doc(`User/${uid}`)).get();

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    return posts;
  } catch (error) {
    console.error('Error retrieving user posts:', error);
    throw new Error('Internal server error');
  }
};

// Function to create a new post for a user
const createPost = async (uid, post, io) => {
  try {
    const postsRef = db.collection('Posts');
    const postDocRef = postsRef.doc(post.pid);
    
    // Convert the uid to a Firestore document reference
    const userDocRef = db.doc(`User/${uid}`);
    postDocRef.set({
      ...post,
      postedBy: userDocRef, // Set postedBy as a reference to the User document
    });

    // After creating the post, emit a 'newPost' event to notify all connected clients about the new post
    io.emit('newPost', post);

    return { message: 'Post created successfully' };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Internal server error');
  }
};

// Function to get all posts
const getAllPosts = async () => {
  try {
    const postsRef = db.collection('Posts');
    const querySnapshot = await postsRef.get();

    const allPosts = [];
    querySnapshot.forEach((doc) => {
      allPosts.push(doc.data());
    });

    return allPosts;
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw new Error('Internal server error');
  }
};

module.exports = { getUserPosts, createPost, getAllPosts };

