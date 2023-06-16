import React from 'react';
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
        <h1>Profile</h1>
        <button onClick = {
            handleSignOut
            }> Sign out 
        </button>   
        
    </div> 
    )   
}

export default Profile;