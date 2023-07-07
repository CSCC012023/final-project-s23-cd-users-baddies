import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Card.css'; // Import the CSS file

function PostCard({ title, description, price, location, postalCode }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/discover'); // Navigate to the '/post' page
  };

  return (
    <Card className="post-card">
      <Card.Body className="post-card-body">
        <Card.Title className="post-card-title">
          <strong>Title:</strong> {title}
        </Card.Title>
        <Card.Text className="post-card-description">
          <strong>Description:</strong> {description}
        </Card.Text>
        <Card.Text className="post-card-text">
          <strong>Price:</strong> {price}
        </Card.Text>
        <Card.Text className="post-card-text">
          <strong>Location:</strong> {location.lon}, {location.lat}
        </Card.Text>
        <Card.Text className="post-card-text">
          <strong>Postal Code:</strong> {postalCode}
        </Card.Text>
        <Button variant="primary" className="post-card-button" onClick={handleButtonClick}>
          View on Map
        </Button>
      </Card.Body>
    </Card>
  );
}

export default PostCard;
