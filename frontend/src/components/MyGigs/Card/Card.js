import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Card.css'; // Import the CSS file
import getAddressFromCoordinates from '../../../utils/utils';

function PostCard({ title, status }) {
  const [address, setAddress] = useState('');

  useEffect(() => {
    []
    // convertCoordinatesToAddress();
  });

  // const convertCoordinatesToAddress = async () => {
  //   try {
  //     console.log(location.lat, location.lon)  
  //     const address = await getAddressFromCoordinates(location.lat, location.lon);
  //     setAddress(address);
  //   } catch (error) {
  //     console.error('Error converting coordinates to address:', error);
  //   }
  // };

  // const handleButtonClick = () => {
  //   onViewMap(); // Call the onViewMap prop
  // };

  return (
    <>
      <Card className="post-card">
        <Card.Body className="post-card-body">
          <Card.Title className="post-card-title">
            <strong>Title:</strong> {title}
          </Card.Title>
          <Card.Text className="post-card-text">
            <strong>Status:</strong> ${status}
          </Card.Text>
          {/* <Card.Text className="post-card-text">
            <strong>Location:</strong> {address}
          </Card.Text>
          <Card.Text className="post-card-text">
            <strong>Postal Code:</strong> {postalCode}
          </Card.Text> */}
          <Button variant="primary" className="post-card-button" onClick={handleButtonClick}>
            Details
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default PostCard;
