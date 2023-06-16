import React, { useState} from 'react';
import ProfilePicture from './Profile pic.jpeg'; // Import the profile picture
import './Profile.css';
import {
    getAuth,
    signOut
} from 'firebase/auth';

const Profile = ({
    user,
    userType
}) => {
    const auth = getAuth();
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log('Signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };
    return (
    <div>
        <div className="profile-container">
      <h1>Welcome Harshil! </h1>
      <div className='left'>
      <div className="profile-content">
        <img src={ProfilePicture} alt="Profile" className="profile-picture" />
         <button
          className={`edit-profile-button`}
        >
          Edit Profile
        </button>
      </div>
      <button onClick = {
            handleSignOut
            }> Sign out 
        </button> 
      </div>
        
     <div className='right'>
     <div className="profile-item">
        <div className="profile-label">Full Name</div>
        <div className="profile-value">Harshil Patel</div>
      </div>
      <div className="profile-item">
        <div className="profile-label">Email</div>
        <div className="profile-value">harshi2060@gmail.com</div>
      </div>
      <div className="profile-item">
        <div className="profile-label">Number</div>
        <div className="profile-value">6478708028</div>
      </div>
      <button className="change-password-btn">Change Password</button>
          </div>
          </div>  
    </div> 
    )   
}

export default Profile;
