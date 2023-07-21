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

const applyForGig = async (selectedPost, userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/gigs/users/${userId}/gigs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pid: selectedPost.pid,
        }),
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

const createNotification = async (receiverId, senderId, text, type) => {
    console.log('receiverId:', receiverId);
    console.log('senderId:', senderId);
  
    try {
      const response = await fetch('http://localhost:3000/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, senderId, text, type }),
      });
  
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to create the notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Error creating notification');
    }
  };
  
export { fetchPosts, applyForGig, listenForNewPosts, createNotification };

