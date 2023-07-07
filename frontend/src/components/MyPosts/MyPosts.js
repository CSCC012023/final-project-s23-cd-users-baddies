import React, { useContext, useEffect, useState } from 'react';
import PostCard from './Card/Card';
import { UserContext } from '../User/UserContext';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const user = useContext(UserContext);
  console.log(posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/users/${user.uid}/posts`);
        if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);
        } else {
          console.error('Error fetching user posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchPosts();
  }, [user.uid]);

  return (
    <div>
      <h1 className="page-title">My Posts</h1>
      {posts.length > 0 && (
        <div className="post-container">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              description={post.description}
              price={post.price}
              location={post.location}
              postalCode={post.postalCode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
