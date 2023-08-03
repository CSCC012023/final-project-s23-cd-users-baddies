import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} style={{ color: 'yellow' }}  />);
  }

  if (hasHalfStar) {
    stars.push(<FaStar key={fullStars} half />);
  }

  for (let i = stars.length; i < totalStars; i++) {
    stars.push(<FaStar key={i} empty />);
  }

  return <div style={{ display: 'flex', marginTop: '10px' }}>{stars}</div>;
};

export default RatingStars;
