import React from 'react';

const Dashboard = ({ user, userType }) => {
  return (
    <div>
      <h1>Welcome to the dashboard, {user.displayName}</h1>
      <p>Your Firebase UID is {user.uid}</p>
      <p>You are a {userType}</p>
    </div>
  );
}

export default Dashboard;
