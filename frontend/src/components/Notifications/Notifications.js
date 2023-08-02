import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import { Flex, Text, Box, Spacer, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody, Input, useColorModeValue, VStack, Heading, IconButton } from "@chakra-ui/react";
import { IoMdNotifications } from 'react-icons/io';
import NotificationItem from './NotificationItem';
import GigRequestNotificationItem from './GigRequestNotificationItem';
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const user = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageText, setMessageText] = useState('');

  const bg = useColorModeValue("gray.100", "gray.700");

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

  useEffect(() => {
    fetchNotifications();
  }, [user.uid]);

  const handleMessageButtonClick = (notification) => {
    setSelectedNotification(notification);
    setMessageText(''); // Clear the message text when opening the modal
  };

  const handleSendMessage = async () => {
    try {
      // Make an API request here to send the message using selectedNotification.senderId and messageText

      setSelectedNotification(null);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAcceptClick = async (notification) => {
    try {
      // Call the API to update the gig-request to gig-response-customer
      const response = await fetch(`http://localhost:3000/api/notifications/update/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'gig-response-customer',
          text: `You have accepted to let business ${notification.senderName} take on your task!`, 
        }),
      });

      if (response.ok) {
        console.log('Notification updated successfully');

        // Notify the business user that their request was accepted
        const notifyResponse = await fetch('http://localhost:3000/api/notifications/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: notification.senderId,
            senderId: user.uid,
            text: 'Your gig request has been accepted!', 
            type: 'gig-response-business',
          }),
        });

        if (notifyResponse.ok) {
          console.log('Business notified successfully');
        } else {
          console.error('Failed to notify business:', notifyResponse.statusText);
        }

        // Refresh the notifications
        fetchNotifications();
      } else {
        console.error('Failed to update notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <Flex direction="column" p={4} marginTop={100} maxW={1200} mx="auto">
      <Flex align="center" mb={6}>
          <Heading size="lg" fontWeight="bold">
              Notifications
          </Heading>
          <Spacer />
          <IconButton
              fontSize="1.75rem"
              color="gray.600"
              aria-label="Notifications"
              icon={<FaBell />}
          />
      </Flex>
      {notifications.length === 0 ? (
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          No Notifications Yet!
        </Text>
      ) : (
        notifications.map((notification) => (
          notification.type === 'gig-request' ? (
            <GigRequestNotificationItem
              key={notification.id}
              notification={notification}
              onMessageButtonClick={handleMessageButtonClick}
              onAcceptClick={handleAcceptClick} 
            />
          ) : (
            <NotificationItem key={notification.id} notification={notification} />
          )
        ))
      )}

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



