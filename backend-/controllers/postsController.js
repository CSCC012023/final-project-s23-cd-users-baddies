const { db } = require('../firebase');

// Function to retrieve posts of a user by UID
const getUserPosts = async (uid) => {
  try {
    const docRef = db.collection('Users').doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const userData = docSnap.data();
      const posts = userData.posts || []; // Assuming posts field is an array in the user document
      return posts;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user posts:', error);
    throw new Error('Internal server error');
  }
};

// Function to create a new post for a user
const createPost = async (uid, post) => {
  try {
    const docRef = db.collection('Users').doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const userData = docSnap.data();

      if (!userData.posts) {
        userData.posts = [];
      }
      userData.posts.push(post);

      await docRef.update({ posts: userData.posts });

      return { message: 'Post created successfully' };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Internal server error');
  }
};

module.exports = { getUserPosts, createPost };