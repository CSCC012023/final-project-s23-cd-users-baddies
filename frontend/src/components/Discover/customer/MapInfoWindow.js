import React from 'react';

const MapInfoWindow = ({ post, onClick }) => {
  return (
    <div style={{ color: 'black' }}>
      <h2>{post?.title}</h2>
      <p>Price: {post?.price}</p>
      <p>Description: {post?.description}</p>
      <p>Location: {post?.location.lat}, {post?.location.lon}</p>
      <button id='logPostButton' onClick={onClick}>Grab Gig</button>
    </div>
  );
};

export default MapInfoWindow;
