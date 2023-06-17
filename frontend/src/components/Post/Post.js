import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import { initializeApp } from "firebase/app";
import { UserContext } from '../User/UserContext';
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

const Post = () => {
  const firebaseConfig = {
    apiKey: "CHANGE_WITH_PEROSNAL",
    authDomain: "cd-user-baddies.firebaseapp.com",
    projectId: "cd-user-baddies",
    storageBucket: "cd-user-baddies.appspot.com",
    messagingSenderId: "CHANGE_WITH_PEROSNAL",
    appId: "1:CHANGE_WITH_PEROSNAL:web:5c6ee1f310aec572c34df5",
    measurementId: "G-4026EEFZZ3"
  };

  const user = useContext(UserContext);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
    const data = await response.json();
    const coordinates = data[0] ? { lat: data[0].lat, lon: data[0].lon } : null;

    if (coordinates) {
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();

      if (userData.userType !== 'customer') {
        console.error('Only customers can post.');
        return;
      }

      const postData = {
        title,
        description,
        price,
        location: coordinates,
        postalCode,
        postedBy: user.uid,
      };

      if (!userData.Posts) {
        userData.Posts = [];
      }
      userData.Posts.push(postData);

      try {
        await setDoc(doc(db, 'Users', auth.currentUser.uid), userData);
        console.log('Post added successfully.');
        navigate('/');
      } catch (error) {
        console.error('Error adding post:', error);
      }
    } else {
      console.error('Could not geocode the location.');
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
