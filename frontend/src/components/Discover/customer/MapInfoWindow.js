import React from 'react';
import { Button } from '@chakra-ui/react'; // Use your preferred UI library for the button

const MapInfoWindow = ({ post, onClick }) => {
  if (!post) {
    return null; // Return null if post is null or undefined
  }
  console.log('helow i work');

  return (
    <div style={{ color: 'black' }}>
       
      <h2>{post?.title}</h2>
      <p>Price: {post?.price}</p>
      <p>Description: {post?.description}</p>
      <p>Location: {post?.location?.lat}, {post?.location?.lon}</p>
      {!post.isButtonClicked && (
          <button
          id="logPostButton"
          onClick={() => {
            console.log('Button clicked:');
            onClick(post);
          }}
          disabled={post.isButtonClicked}
        >
          Grab Gig
        </button>
      )}
    </div>
  );
};

export default MapInfoWindow;



