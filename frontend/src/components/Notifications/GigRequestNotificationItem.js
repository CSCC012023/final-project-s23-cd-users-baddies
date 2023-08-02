import React, { useRef, useState } from 'react';
import { Flex, Text, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";

const GigRequestNotificationItem = ({ notification, onMessageButtonClick, onAcceptClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const handleAcceptClick = () => {
    setDialogType('accept');
    setIsOpen(true);
  };

  const handleDeclineClick = () => {
    setDialogType('decline');
    setIsOpen(true);
  };

  const handleMessageClick = () => {
    onMessageButtonClick(notification);
  };

  const handleConfirmation = () => {
    onClose();
    if (dialogType === 'accept') {
      onAcceptClick(notification);
    } else {
      console.log('Decline confirmed for notification:', notification);
    }
  };

  return (
    <Flex direction="column" borderWidth="1px" borderRadius="lg" p={4} m={4} boxShadow="sm" bg="gray.200">
      <Flex justify="space-between" mb={2}>
        <Text fontSize="lg" fontWeight="bold">{notification.text}</Text>
        <Text fontSize="sm" color="gray.600">{new Date(notification.timestamp).toLocaleString()}</Text>
      </Flex>
      <Flex justify="space-between">
        <Flex>
          <Button colorScheme="green" variant="outline" size="sm" mr={2} onClick={handleAcceptClick}>Accept</Button>
          <Button colorScheme="red" variant="outline" size="sm" mr={2} onClick={handleDeclineClick}>Decline</Button>
          <Button colorScheme="blue" variant="outline" size="sm" onClick={handleMessageClick}>Message</Button>
        </Flex>
      </Flex>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {`Confirm ${dialogType}`}
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure you want to ${dialogType} this gig request?`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmation} ml={3}>
                {`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default GigRequestNotificationItem;
