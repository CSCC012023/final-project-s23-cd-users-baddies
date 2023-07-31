import React from 'react';
import GoogleMapContainer from './GoogleMap';
import './Discover.css';

const DiscoverPosts = () => {
  return (
    <div className="bodyy">
      <h1 className="title">Discover</h1>
      <div className="map">
        <GoogleMapContainer />
      </div>
    </div>
  );
};

export default DiscoverPosts;