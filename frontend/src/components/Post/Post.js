import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import { UserContext } from '../User/UserContext';

const Post = () => {
  const user = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch coordinates from the location
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData && geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];

        // Make a POST request to the backend API
        const response = await fetch(`http://localhost:3000/api/posts/users/${user.uid}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            description,
            price,
            location: { lat, lon },
            postalCode
          })
        });

        if (response.ok) {
          console.log('Post added successfully.');
          navigate('/');
        } else {
          console.error('Error adding post:', response.statusText);
        }
      } else {
        console.error('Could not geocode the location.');
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="post-form-container">
      {user.userType === 'customer' ? (
        <form className="post-form" onSubmit={handleSubmit}>
          <label>
            Postal Code:
            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </label>
          <label>
            Title:
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          </label>
          <label>
            Description:
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label>
            Price:
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </label>
          <label>
            Location:
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
          </label>
          <button type="submit">Post</button>
        </form>
      ) : (
        <div className="only-customer-message">
          Only customers can post. Please switch to a customer account to create posts.
        </div>
      )}
    </div>
  );
};

export default Post;

