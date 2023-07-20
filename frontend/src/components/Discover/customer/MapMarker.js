import React from 'react';
import { Marker } from 'google-maps-react';

const MapMarker = ({ post, onClick }) => {
  return (
    <Marker
      onClick={onClick}
      name={post.title}
      position={{ lat: post.location.lat, lng: post.location.lon }}
    />
  );
};

export default MapMarker;
