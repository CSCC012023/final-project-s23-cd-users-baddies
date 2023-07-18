import React, { useContext, useEffect, useState } from 'react';
import MyVerticallyCenteredModal from './PopUp/PopUp';
import { UserContext } from '../User/UserContext';
import {
  Card,
  Image,
  Stack,
  Heading,
  Text,
  ButtonGroup,
  CardBody,
  CardFooter,
  Button,
  Box,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(); // assume firebase is already initialized

const MyPosts = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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
      const businessesSnapshot = await getDocs(
        query(collection(db, 'Users'), where('userType', '==', 'business'))
      );
      businessesSnapshot.forEach(async (businessDoc) => {
        const businessData = businessDoc.data();

        if (
          businessData.Gigs &&
          businessData.Gigs.find((gig) => gig.postId === updatedPost.id)
        ) {
          // Map over gigs, update the one with matching postId
          const updatedGigs = businessData.Gigs.map((gig) =>
            gig.postId === updatedPost.id
              ? { ...gig, status: 'completed' }
              : gig
          );

          // Update gigs in Firestore
          await updateDoc(doc(db, 'Users', businessData.uid), {
            Gigs: updatedGigs,
          });
          const newMessage = {
            text: `Job '${currentPost.title}' has been completed.`,
            timestamp: Date.now(),
            type: 'notification',
          };

          // Add the new message to business's messages array
          // Check if the messages array exists. If not, initialize it.
          let updatedMessages = businessData.messages
            ? [...businessData.messages, newMessage]
            : [newMessage];

          // Update gigs and messages in Firestore
          await updateDoc(doc(db, 'Users', businessData.uid), {
            Gigs: updatedGigs,
            messages: updatedMessages,
          });
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
  }, []); // Empty dependency array to run the effect only once

  const onViewMap = (post) => {
    setSelectedPost(post);
    setModalShow(true);
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: "50px", position: "sticky", top: "0" }}>
        My Posts
      </h1>
      <div>
        {posts.length > 0 && (
          <div className="post-container">
            <Box display="flex" flexWrap="wrap">
              {posts.map((post) => (
                <Card key={post.id} maxW="sm" flex="1" mr={10} mb={4}>
                  <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                    <CardBody>
                      {/* <Image
                        src={post.image}
                        alt={post.title}
                        borderRadius="lg"
                      /> */}
                      <Stack mt='6' spacing='3'>
                        <Heading size='lg'>{post.title}</Heading>
                        <Text fontSize='md'>{post.description}</Text>
                        <Text color='blue.600' fontSize='2xl'>
                          ${post.price}
                        </Text>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue'>
                          Details
                        </Button>
                        <Button variant='solid' colorScheme='teal'>
                          Complete
                        </Button>
                      </ButtonGroup>
                    </CardFooter>
                  </Box>
                </Card>
              ))}
            </Box>
          </div>
        )}

        {/* Render the modal when modalShow is true */}
        {modalShow && (
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            post={selectedPost} // Pass the selected post as a prop to the modal
          />
        )}

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
      </div>
    </div>
  );
};

export default MyPosts;
