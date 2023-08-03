import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Heading, Text, Stack, Flex } from "@chakra-ui/react";
import RatingStars from "./Rating";
import { UserContext } from "../../User/UserContext";

function ReviewCard({ review }) {
    const [customer, setCustomer] = useState('');
    const rating = review.rating || 0; // Default to 0 if rating is not provided
    const feedback = review.feedback || 'No feedback provided'; // Default message if feedback is not provided
    const date = new Date(review.createdAt._seconds * 1000).toLocaleDateString()
    const user = useContext(UserContext);
    useEffect(() => {
      const fetchCustomerName = async () => {
        try {
          const customerDoc = await axios.get(`http://localhost:3000/api/users/profile/${user.uid}`);
          setCustomer(customerDoc.data.Name);
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      };
  
      fetchCustomerName();
    }, [review.customerAccount]);

    return (
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
            >

        <Stack>
          <CardBody>
            <Heading size='md' align="left">
              {customer}
              <Flex>
                <RatingStars rating={rating} />
                <Text mt="9px" ml="10px" color="gray.600"> {date} </Text>
              </Flex>
            </Heading>

            <Text py='2'>
              {feedback}
            </Text>
          </CardBody> 
        </Stack>
      </Card>
    );
  }

export default ReviewCard;
