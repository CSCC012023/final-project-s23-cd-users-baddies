import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import { Button, Box, Divider } from "@chakra-ui/react";
import { getFirestore, doc,setDoc, getDoc, updateDoc, arrayRemove ,arrayUnion} from "firebase/firestore";

const db = getFirestore(); // assume firebase is already initialized

const Messages = () => {
  const user = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const userRef = doc(db, 'Users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists() && userSnapshot.data().messages) {
      setMessages(userSnapshot.data().messages);
    }
  }

  const handleAccept = async (message) => {
    try {
      // Get reference to user document
      const userRef = doc(db, 'Users', user.uid);
  
      // Get current user data
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
  
      // Map over messages, update the one with matching timestamp
      const updatedMessages = userData.messages.map((msg) =>
        msg.timestamp === message.timestamp
          ? { ...msg, type: 'notification', text: `Your gig has been accepted by ${message.senderId}` }
          : msg
      );
  
      // Map over posts to find and update the related post
      let postTitle = '';
      const updatedPosts = userData.posts.map((post) =>
        post.id === message.postId
          ? (postTitle = post.title, { ...post, status: 'pending' })  // find postTitle and set the post status to 'pending'
          : post
      );
  
      // Update posts and messages in Firestore
      await updateDoc(userRef, { posts: updatedPosts, messages: updatedMessages });
    
      // Updating 'gigs' of the business user, add 'gig' into its 'gigs' array
      const businessRef = doc(db, 'Users', message.senderId);
      const businessSnap = await getDoc(businessRef);
      const businessData = businessSnap.data();
  
      if (postTitle) {
        const newGig = {
          postId: message.postId,  // changed id with postId
          title: postTitle,  // use postTitle here
          status: 'pending',
          timestamp: message.timestamp,
        };
  
        // Add the new 'gig' into 'gigs' array in 'business' document
        await updateDoc(businessRef, { Gigs: arrayUnion(newGig) });
  
        // Create the confirmation message for the business
        const confirmationMessage = {
          senderId: user.uid,
          senderName: "System",
          text: `Your offer on gig '${postTitle}' has been accepted.`,
          timestamp: Date.now(),
          type: "notification"
        };
  
        // Add the confirmation message to 'messages' array in 'business' document
        if (!businessData.messages) {
          await setDoc(businessRef, {
            messages: [confirmationMessage]
          }, { merge: true });  // the { merge: true } option makes sure that the rest of the document is not overwritten
        } else { 
          await updateDoc(businessRef, {
            messages: arrayUnion(confirmationMessage)
          });
        }
      }
  
      // Update local state
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDecline = async (message, index) => {
    // simply remove the message from user document and local state
    const userRef = doc(db, 'Users', user.uid);
    await updateDoc(userRef, {
      messages: arrayRemove(message)
    });

    const newMessages = messages.filter((_,msgIndex) => msgIndex !== index);
    setMessages(newMessages);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Box maxW="sm" borderWidth={1} borderRadius="lg" overflow="hidden" mt={6}>
      <Box p="6">
        {messages.map((message, index) => (
          <Box key={index} d="flex" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
            >
              From: {message.senderName}
            </Box>
            <Divider mt={2} mb={2} />
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
              {message.text}
            </Box>
            {message.type === 'response' && (
              <>
                <Button colorScheme="teal" size="xs" mt={3} onClick={() => handleAccept(message, index)}>Accept</Button>
                <Button colorScheme="red" size="xs" mt={3} ml={3} onClick={() => handleDecline(message, index)}>Decline</Button>
              </>
            )}
            <Divider my={2} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Messages;