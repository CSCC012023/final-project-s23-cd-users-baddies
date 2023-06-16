import React from 'react';
import './Post.css';

export default function PostPage() {
  return (
    <div className="containerr">
      <h1>Share Post</h1>
      <div className="form-group">
        <label htmlForm="image">Image</label>
        <input type="file" id="image" />
      </div>
      <div className="form-group">
        <label htmlFor="caption">Caption</label>
        <textarea id="caption" rows="3"></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tag People</label>
        <input type="text" id="tags" />
      </div>
      <button className="share-button">Share</button>
    </div>
  );
}



// import React from 'react';

// const Post = ({ postalCode, title, description, price, image }) => (
//   <div>
//     <p>Postal Code: {postalCode}</p>
//     <p>Title: {title}</p>
//     <p>Description: {description}</p>
//     <p>Price: {price}</p>
//     <img src={image} alt={title} />
//   </div>
// );

// export default Post;