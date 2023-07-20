import ioClient from 'socket.io-client';

const socket = ioClient('http://localhost:3000');

const fetchPosts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/posts');
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts');
  }
};

const applyForGig = async (post) => {
  try {
    const response = await fetch('http://localhost:3000/api/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: post.pid,
        businessId: 'YOUR_BUSINESS_ID' // Replace with the ID of the business applying for the gig
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result.message;
    } else {
      throw new Error('Failed to apply for the gig');
    }
  } catch (error) {
    console.error('Error applying for the gig:', error);
    throw new Error('Error applying for the gig');
  }
};

const listenForNewPosts = (onNewPostReceived) => {
  socket.on('newPost', (post) => {
    onNewPostReceived(post);
  });

  socket.on('connect', () => {
    console.log('Socket ID:', socket.id);
  });
};

export { fetchPosts, applyForGig, listenForNewPosts };

