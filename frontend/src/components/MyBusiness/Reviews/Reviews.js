import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { UserContext } from "../../User/UserContext";
import { useState, useContext, useEffect } from 'react';


function ReviewsTab() {
    const [reviews, setReviews] = useState([]);
    const user = useContext(UserContext);
  
    useEffect(() => {
      fetchReviews();
    }, []);
  
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/${user.uid}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    return (
      <Box>
        <Heading as="h2" size="xl" mb={4}>
          My Reviews
        </Heading>
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review.reviewId} review={review} />)
        ) : (
          <Text>No reviews found.</Text>
        )}
      </Box>
    );
  }

export default ReviewsTab;