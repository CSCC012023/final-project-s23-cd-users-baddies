import React, { useContext} from 'react';
import ProfilePicture from './Profile pic.jpeg'; // Import the profile picture
import './Profile.css';
import { UserContext } from '../User/UserContext';
import {
    getAuth,
    signOut
} from 'firebase/auth';

const Profile = ({
}) => {
  const user = useContext(UserContext);
  console.log(user);
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
      <h1>Welcome {user.Name}! </h1>
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
        <div className="profile-value">{user.Name}</div>
      </div>
      <div className="profile-item">
        <div className="profile-label">Number</div>
              <div className="profile-value">{ user.contactNumber}</div>
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
