import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import { Flex, Text, Box, Divider, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody, Input } from "@chakra-ui/react";
import { IoMdNotifications } from 'react-icons/io';
import NotificationItem from './NotificationItem';
import GigRequestNotificationItem from './GigRequestNotificationItem';

const Notifications = () => {
  const user = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/notifications/${user.uid}`);
        if (response.ok) {
          const notificationsData = await response.json();
          setNotifications(notificationsData);
        } else {
          console.error('Error getting notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user.uid]);

  // Function to handle the "Message" button click and open the modal
  const handleMessageButtonClick = (notification) => {
    setSelectedNotification(notification);
    setMessageText(''); // Clear the message text when opening the modal
  };

  // Function to handle the "Send" button click in the modal
  const handleSendMessage = async () => {
    try {
      // Make an API request here to send the message using selectedNotification.senderId and messageText

      // Close the modal after sending the message
      setSelectedNotification(null);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to handle the "Accept" button click and send the "response-gig" notification
  const handleAcceptClick = async (notification) => {
    try {
      // Call the API to send the "response-gig" notification
      const response = await fetch('http://localhost:3000/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: "NL31G8cnNuhMYjNXruZYXhRt3503", // Use the senderId from the original "gig-request" notification
          senderId: user.uid,
          text: 'Your gig request has been accepted!', // Customize the notification message
          type: 'response-gig',
        }),
      });

      if (response.ok) {
        // Handle the success response here (if needed)
        console.log('Response-gig notification sent successfully');
      } else {
        console.error('Failed to send response-gig notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending response-gig notification:', error);
    }
  };

  return (
    <Flex direction="column" p={4}>
      <Flex align="center" mb={4}>
        <Box as={IoMdNotifications} fontSize="2xl" color="gray.600" mr={2} />
        <Text fontSize="2xl" fontWeight="bold">
          Notifications
        </Text>
      </Flex>
      {notifications.length === 0 ? (
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          No Notifications Yet!
        </Text>
      ) : (
        notifications.map((notification) => (
          notification.type === 'gig-request' ? (
            // Render the GigRequestNotificationItem for notifications of type 'gig-request'
            <GigRequestNotificationItem
              key={notification.id}
              notification={notification}
              onMessageButtonClick={handleMessageButtonClick}
              onAcceptClick={handleAcceptClick} // Pass the handleAcceptClick function to the component
            />
          ) : (
            // Render the regular NotificationItem for other types of notifications
            <NotificationItem key={notification.id} notification={notification} />
          )
        ))
      )}

      {/* Modal for sending a message */}
      <Modal isOpen={selectedNotification && selectedNotification.type === 'gig-request'} onClose={() => setSelectedNotification(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSendMessage}>
              Send
            </Button>
            <Button onClick={() => setSelectedNotification(null)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Notifications;


