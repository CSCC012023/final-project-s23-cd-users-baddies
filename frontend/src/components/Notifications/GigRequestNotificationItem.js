import React from 'react';
import { Flex, Text, Button } from "@chakra-ui/react";

const GigRequestNotificationItem = ({ notification, onMessageButtonClick, onAcceptClick }) => {
  const handleAcceptClick = () => {
    // Call the function provided by the parent component to handle "Accept" button click
    onAcceptClick(notification);
  };

  const handleDeclineClick = () => {
    // Implement functionality to handle "Decline" button click here
    console.log('Decline clicked for notification:', notification);
  };

  const handleMessageClick = () => {
    // Pass the notification to the parent component when the "Message" button is clicked
    onMessageButtonClick(notification);
  };

  return (
    <Flex
      direction="column"
      borderWidth="1px"
      borderRadius="md"
      p={3}
      mb={2}
      bg="gray.900"
    >
      <Flex justify="space-between" mb={2}>
        <Text fontWeight="bold">{notification.text}</Text>
        <Text fontSize="sm" color="gray.600">
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
      </Flex>
      <Flex justify="space-between">
        <Flex>
          <Button
            colorScheme="green"
            variant="outline"
            size="sm"
            mr={2}
            onClick={handleAcceptClick}
          >
            Accept
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            mr={2}
            onClick={handleDeclineClick}
          >
            Decline
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={handleMessageClick}
          >
            Message
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GigRequestNotificationItem;
