import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../User/UserContext';
import getAddressFromCoordinates from '../../utils/utils';
import {
  Card,
  Stack,
  Heading,
  Text,
  ButtonGroup,
  CardBody,
  CardFooter,
  Button,
  Box,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea 
} from "@chakra-ui/react";
import axios from 'axios';

const MyPosts = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("posted");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isCompleteOpen, onOpen: onCompleteOpen, onClose: onCompleteClose } = useDisclosure();
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();

  const filterPostsByStatus = (status) => {
    setFilteredStatus(status);
  };

  const handleCompletePost = async (post) => {
    try {
      const postId = post.pid;
      const gigId = post.gid; // assuming gid is available in post object
      await axios.put(`http://localhost:3000/api/posts/${postId}`, {
        status: "completed",
      });
  
      // Update gig status
      await axios.put(`http://localhost:3000/api/gigs/${gigId}`, {
        newStatus: "completed",
      });
      
      // Update the post status in the local state if necessary
      // For example, you could filter the post list and remove the completed post
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.pid === postId ? { ...p, status: "completed" } : p))
      );
      
      setSelectedPost(null); // Reset the selectedPost state
      onCompleteClose(); // Close the modal after successful completion
      
      // After completing the post, ask the user if they want to leave a review
      setIsReviewing(true);
      onReviewOpen();
      
    } catch (error) {
      console.error('Error completing the post:', error);
    }
  };

  const handleReviewSubmit = () => {
    // Call your API to save the review
    // For now we just have a placeholder function
    console.log('Review submitted');
    
    setIsReviewing(false);
    onReviewClose();
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // console.log(user.uid);
        const response = await axios.get(`http://localhost:3000/api/posts/users/${user.uid}/posts`);
        const postsWithAddresses = await Promise.all(
          response.data.map(async (post) => {
            const address = await getAddressFromCoordinates(post.location.lat, post.location.lon);
            return { ...post, address };
          })
        );
        setPosts(postsWithAddresses);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
  
    fetchUserPosts();
  }, [user.uid]);

  return (
    <div>
      <Box
        position="fixed"
        top={120}
        left={0}
        right={0}
        display="flex"
        justifyContent="center"
        p={4}
      >
        <Stack spacing={3} direction="row" align="center" display="flex">
          <Button colorScheme="teal" onClick={() => filterPostsByStatus("posted")}>
            Posted
          </Button>
          <Button colorScheme="red" onClick={() => filterPostsByStatus("in-progress")}>
            In Progress
          </Button>
          <Button colorScheme="teal" onClick={() => filterPostsByStatus("completed")}>
            Completed
          </Button>
        </Stack>
      </Box>
      <Text mt={10} position="fixed" top={180} left={0} right={0} textAlign="center" fontSize="xl" fontWeight="bold">
        {filteredStatus.charAt(0).toUpperCase() + filteredStatus.slice(1)}
      </Text>
    
    {posts.filter((post) => post.status === filteredStatus).length > 0 && (
      <div className="post-container">
        <Box display="flex" flexWrap="wrap" justifyContent="center" marginTop="60">
          {posts
            .filter((post) => post.status === filteredStatus)
            .map((post) => (
              <Card key={post.id} maxW="sm" flex="none" width="250px" m={6}>
                <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                  <CardBody>
                    <Stack mt="6" spacing="4">
                      <Heading size="lg">{post.title}</Heading>
                      <Text fontSize="lg">Status: {post.status}</Text>
                      <Text color="blue.600" fontSize="xl">
                        ${post.price}
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing="2" margin="10px" >
                      <Button onClick={onDetailsOpen} variant="solid" colorScheme="blue" ml={post.status === "posted" || post.status === "completed"? "50px" : "flex-start"} >
                        Details
                      </Button>
                      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                        <ModalOverlay />
                        <ModalContent
                          position="absolute"
                          top="25%"
                          transform="translate(-50%, -50%)"
                          maxW="80%" // Optional: Set the maximum width of the modal
                          width="fit-content" // Optional: Adjust the width based on the modal content
                        >
                          <ModalHeader>{post.title}</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <Text>Description: {post.description}</Text>
                            <Text>Location: {post.address}</Text>
                            <Text>Price: ${post.price}</Text>
                          </ModalBody>

                          <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onDetailsClose}>
                              Close
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                      {post.status === "in-progress" && (
                      <Button variant="solid" colorScheme="teal" onClick={() => {
                        setSelectedPost(post); // Set the selectedPost before opening the modal
                        onCompleteOpen();
                      }}>
                        Complete
                      </Button>
                      
                    )}
                    <Modal isOpen={isCompleteOpen} onClose={onCompleteClose}>
                        <ModalOverlay />
                        <ModalContent
                          position="absolute"
                          top="25%"
                          transform="translate(-50%, -50%)"
                          maxW="80%"
                          width="fit-content"
                        >
                          <ModalHeader>{selectedPost && selectedPost.title}</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            Are you sure you want to complete this task?
                          </ModalBody>

                          <ModalFooter>
                            <Button colorScheme='teal' mr={3} onClick={() => handleCompletePost(selectedPost)}>
                              Complete
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </ButtonGroup>
                  </CardFooter>
                </Box>
              </Card>
            ))}
        </Box>
      </div>
    )}

    <Modal isOpen={isReviewOpen} onClose={onReviewClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Leave a Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isReviewing && (
            <form>
              <FormControl id="rating" isRequired>
                <FormLabel>Rating</FormLabel>
                <Input type="number" min="1" max="5" />
              </FormControl>
              <FormControl id="review" isRequired>
                <FormLabel>Review</FormLabel>
                <Textarea />
              </FormControl>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleReviewSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </div>
  );
};

export default MyPosts;
