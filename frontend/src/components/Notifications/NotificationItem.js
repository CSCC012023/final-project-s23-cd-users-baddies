import React from 'react';
import { Flex, Text, Box, Divider, useColorModeValue } from "@chakra-ui/react";

const NotificationItem = ({ notification }) => {
  const { text, timestamp, type } = notification;

  const bgColor = useColorModeValue(
    type === 'gig-response-customer' ? 'green.100' :
    type === 'gig-decline-customer' ? 'red.100' : 'white',
    type === 'gig-response-customer' ? 'green.600' :
    type === 'gig-decline-customer' ? 'red.600' : 'gray.700'
  );
  
  return (
    <Box p={4} m={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" bg={bgColor}>
      <Flex justify="space-between">
        <Text fontSize="lg" fontWeight="medium">{text}</Text>
        <Text fontSize="sm" color="gray.500">{new Date(timestamp).toLocaleString()}</Text>
      </Flex>
      <Text fontSize="sm" color="gray.500">{type}</Text>
      <Divider my={2} />
    </Box>
  );
};

export default NotificationItem;

