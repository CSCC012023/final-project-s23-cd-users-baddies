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
        return result; // returning entire result
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

const createNotification = async (receiverId, senderId, text, type, gid, pid) => {
    console.log('receiverId:', receiverId);
    console.log('senderId:', senderId);
    console.log('gId:', gid);
    console.log('pId:', pid);
  
    try {
      const response = await fetch('http://localhost:3000/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, senderId, text, type, gigId: gid, postId: pid }),
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
  
  
  const checkIfPostIsRequestedByUser = async (selectedPost, userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/gigs/users/${userId}/checkIfPostRequested/${selectedPost.pid}`);
      if (!response.ok) {
        throw new Error('Failed to check if post is requested by user');
      }
  
      const data = await response.json();
      return data.isPostRequested;
    } catch (error) {
      console.error('Error checking if post is requested by user:', error);
      throw new Error('Error checking if post is requested by user');
    }
  };
  
  

export { fetchPosts, applyForGig, listenForNewPosts, createNotification, checkIfPostIsRequestedByUser };

