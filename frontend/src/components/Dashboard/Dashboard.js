import React from 'react';
import {
    getAuth,
    signOut
} from 'firebase/auth';


const Dashboard = ({
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
    return ( <
        div >
        <
        h1 > Welcome to the dashboard, {
            user.displayName
        } < /h1> <
        p > Your Firebase UID is {
            user.uid
                } < /p>
                <
                p > Your name is {
                    user.Name
                        } < /p>
                        <
        p > Your numner is {
            user.contactNumber
                } < /p>
                <
                p > Your postal code is {
                    user.postalCode
                        } < /p>
                
                <
        p > You are a {
            userType
        } < /p> <
        
        button onClick = {
            handleSignOut
        } > Sign out < /button> < /
        div >
    );
}

export default Dashboard;