import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import { Button, Box, Divider, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, collection, arrayUnion, query, where, getDocs } from "firebase/firestore";

const db = getFirestore(); // assume firebase is already initialized

const MyPosts = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [btnRef, setBtnRef] = useState(null);

  const onClose = () => setIsOpen(false);

  const fetchPosts = async () => {
    const userRef = doc(db, 'Users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists() && userSnapshot.data().posts) {
      setPosts(userSnapshot.data().posts);
    }
  }

  const handleComplete = async () => {
    if (currentPost) {
      // At complete job, switch the post status to 'completed'
      const updatedStatus = 'completed';
      const updatedPost = { ...currentPost, status: updatedStatus };

      // Replace the post in user's document and local state
      const userRef = doc(db, 'Users', user.uid);
      const updatedPosts = posts.map((curPost) =>
        curPost.postId === updatedPost.postId ? updatedPost : curPost
      );

      await updateDoc(userRef, { posts: updatedPosts });
      setPosts(updatedPosts);

      // Find all businesses who have this post in their gigs
      const businessesSnapshot = await getDocs(query(collection(db, 'Users'), where('userType', '==', 'business')));
      businessesSnapshot.forEach(async (businessDoc) => {
        const businessData = businessDoc.data();

        if (businessData.Gigs && businessData.Gigs.find((gig) => gig.postId === updatedPost.id)) {
          // Map over gigs, update the one with matching postId
          const updatedGigs = businessData.Gigs.map((gig) =>
            gig.postId === updatedPost.id ? { ...gig, status: 'completed' } : gig
          );

          // Update gigs in Firestore
            await updateDoc(doc(db, 'Users', businessData.uid), { Gigs: updatedGigs });
            const newMessage = {
                text: `Job '${currentPost.title}' has been completed.`,
                timestamp: Date.now(),
                type: 'notification',
              };
            
              // Add the new message to business's messages array
              // Check if the messages array exists. If not, initialize it.
              let updatedMessages = businessData.messages ? [...businessData.messages, newMessage] : [newMessage];
            
              // Update gigs and messages in Firestore
              await updateDoc(doc(db, 'Users', businessData.uid), { Gigs: updatedGigs, messages: updatedMessages });
        }
      });
    }

    onClose(); // Close the dialog
  }

  const promptCompleteDialog = (post) => {
    setIsOpen(true);
    setCurrentPost(post);
    setBtnRef(document.getElementById(post.postId)); // Set reference for dialog
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box maxW="sm" borderWidth={1} borderRadius="lg" overflow="hidden" mt={6}>
      <Box p="6">
        {posts.map((post, index) => (
          <Box key={index} d="flex" alignItems="baseline" mb={4}>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
            >
              {post.title}
            </Box>
            <Divider mt={2} mb={2} />
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
              Status: {post.status}
            </Box>
            <Button id={post.postId} colorScheme="teal" size="xs" mt={3} onClick={() => promptCompleteDialog(post)}>Complete Job</Button>
          </Box>
        ))}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={btnRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Complete Job
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You cannot undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={btnRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="green" onClick={handleComplete} ml={3}>
                  Complete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
};

export default MyPosts;
