import React from 'react';

const Post = ({ postalCode, title, description, price, image }) => (
  <div>
    <p>Postal Code: {postalCode}</p>
    <p>Title: {title}</p>
    <p>Description: {description}</p>
    <p>Price: {price}</p>
    <img src={image} alt={title} />
  </div>
);

export default Post;