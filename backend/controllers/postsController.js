const { db } = require('../firebase');

// Function to retrieve posts of a user by UID
const getUserPosts = async (uid) => {
  try {
    const postsRef = db.collection('Posts');
    const querySnapshot = await postsRef.where('postedBy', '==', db.doc(`Users/${uid}`)).get();

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
const createPost = async (uid, post) => {
  try {
    // Add the status field to the post object
    post.status = 'posted';
    post.pid = Date.now().toString(); // Use a string representation for pid field (for consistency with Firestore)
    post.postedBy = db.doc(`Users/${uid}`); // Reference to the user who created the post

    const postsRef = db.collection('Posts');
    await postsRef.doc(post.pid).set(post);

    return { message: 'Post created successfully' };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Internal server error');
  }
};

module.exports = { getUserPosts, createPost };
