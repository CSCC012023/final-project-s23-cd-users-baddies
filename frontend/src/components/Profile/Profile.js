import React, { useState, useContext } from 'react';
import ProfilePicture from './Profile pic.jpeg'; // Import the profile picture
import './Profile.css';
import { UserContext } from '../User/UserContext';
import {
  getAuth,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";

const Profile = ({ }) => {
  const user = useContext(UserContext);
  const [name, setName] = useState(user.Name);
  const [number, setNumber] = useState(user.contactNumber);

  const auth = getAuth();
  const db = getFirestore();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleSave = async () => {
    if (name === '' || number === '') {
      alert('Fields cannot be empty');
      return;
    }

    const userRef = doc(db, 'Users', auth.currentUser.uid);

    await updateDoc(userRef, {
      Name: name,
      contactNumber: number,
    });
  };

  return (
    <div>
      <div className="profile-container">
        <h1>Welcome {user.Name}! </h1>
        <div className='left'>
          <div className="profile-content">
            <img src={ProfilePicture} alt="Profile" className="profile-picture" />
            <button
              className={`edit-profile-button`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <button onClick={handleSignOut}> Sign out </button>
        </div>

        <div className='right'>
          <div className="profile-item">
            <div className="profile-label">Full Name</div>
            <input type="text" className="profile-value" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="profile-item">
            <div className="profile-label">Number</div>
            <input type="text" className="profile-value" value={number} onChange={e => setNumber(e.target.value)} />
          </div>
          <div className="profile-item">
            <div className="profile-label">Rating</div>
            <div className="profile-value">{user.Rating}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
