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
      const updatedTimestamp = Date.now();
      
      // Update the status of the gig to "in-progress"
      console.log(notification.gig.gid)
      const responseGigUpdate = await fetch(`http://localhost:3000/api/gigs/${notification.gig.gid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newStatus: 'in-progress',
        }),
      });
  
      if (!responseGigUpdate.ok) {
        console.error('Failed to update gig status:', responseGigUpdate.statusText);
        return;
      }
  
      // Call the API to update the post status to "in-progress"
      const responsePostUpdate = await fetch(`http://localhost:3000/api/posts/${notification.post.pid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'in-progress',
          gid: notification.gig.gid,
        }),
      });
  
      if (!responsePostUpdate.ok) {
        console.error('Failed to update post status:', responsePostUpdate.statusText);
        return;
      }
  
      // Call the API to update the customer's notification
      const responseUpdate = await fetch(`http://localhost:3000/api/notifications/${user.uid}/${notification.timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `You have accepted to let business ${notification.sender.Business.Name} take on your task!`,
          type: 'gig-response-customer',
          timestamp: updatedTimestamp,  // Updating the timestamp
        }),
      });
  
      if (responseUpdate.ok) {
        // Update the customer's notification in the local state
        setNotifications(notifications.map((notif) => {
          if (notif.timestamp === notification.timestamp) {
            return {
              ...notif,
              text: `You have accepted to let business ${notification.sender.Business.Name} take on your task!`,
              type: 'gig-response-customer',
              timestamp: updatedTimestamp,
            };
          } else {
            return notif;
          }
        }));
  
        // Create a new notification for the business
        const responseCreate = await fetch('http://localhost:3000/api/notifications/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: notification.sender.uid, // The sender of the original notification
            senderId: user.uid,
            text: `User ${user.uid} has accepted your task!`,
            type: 'gig-response-business',
          }),
        });
  
        if (!responseCreate.ok) {
          console.error('Failed to create notification:', responseCreate.statusText);
        }
      } else {
        console.error('Failed to update notification:', responseUpdate.statusText);
      }
    } catch (error) {
      console.error('Error handling accept click:', error);
    }
  };
  

  const handleDeclineClick = async (notification) => {
    try {
      const updatedTimestamp = Date.now();

      // Call the API to delete the gig
      const responseGigDelete = await fetch(`http://localhost:3000/api/gigs/${notification.gig.gid}/${notification.sender.uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!responseGigDelete.ok) {
        console.error('Failed to delete gig:', responseGigDelete.statusText);
        return;
      }
      
      // Call the API to update the customer's notification
      const responseUpdate = await fetch(`http://localhost:3000/api/notifications/${user.uid}/${notification.timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `You have declined business ${notification.sender.Business.Name} from taking on your task!`,
          type: 'gig-decline-customer',
          timestamp: updatedTimestamp,
        }),
      });

      if (responseUpdate.ok) {
        // Update the customer's notification in the local state
        setNotifications(notifications.map((notif) => {
          if (notif.timestamp === notification.timestamp) {
            return {
              ...notif,
              text: `You have declined business ${notification.sender.Business.Name} from taking on your task!`,
              type: 'gig-decline-customer',
              timestamp: updatedTimestamp,
            };
          } else {
            return notif;
          }
        }));

        // Create a new notification for the business
        const responseCreate = await fetch('http://localhost:3000/api/notifications/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: notification.sender.uid, // The sender of the original notification
            senderId: user.uid,
            text: `User ${user.Name} has declined your gig request for ${notification.post.title}!`,
            type: 'gig-decline-business',
          }),
        });

        if (!responseCreate.ok) {
          console.error('Failed to create notification:', responseCreate.statusText);
        }
      } else {
        console.error('Failed to update notification:', responseUpdate.statusText);
      }
    } catch (error) {
      console.error('Error handling decline click:', error);
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
            onDeclineClick={handleDeclineClick}
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



