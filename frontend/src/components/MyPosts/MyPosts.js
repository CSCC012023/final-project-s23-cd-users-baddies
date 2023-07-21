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
  useDisclosure 
} from "@chakra-ui/react";
import axios from 'axios';


const MyPosts = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("posted");
  const [selectedPost, setSelectedPost] = useState(null);

  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isCompleteOpen, onOpen: onCompleteOpen, onClose: onCompleteClose } = useDisclosure();


  const filterPostsByStatus = (status) => {
    setFilteredStatus(status);
  };

  const completePost = async (post) => {
    try {
      const postId = post.pid;
      await axios.put(`http://localhost:3000/api/posts/${postId}`, {
        status: "completed",
      });
      
      // Update the post status in the local state if necessary
      // For example, you could filter the post list and remove the completed post
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.pid === postId ? { ...p, status: "completed" } : p))
      );
      
      setSelectedPost(null); // Reset the selectedPost state
      onCompleteClose(); // Close the modal after successful completion
    } catch (error) {
      console.error('Error completing the post:', error);
    }
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
  }, [posts, user.uid]);

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
          <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" marginTop="500px">
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
                              <Text>Are you sure?</Text>
                            </ModalBody>
                            <ModalFooter>
                            <Button colorScheme='teal' mr={3} onClick={() => completePost(selectedPost)}>
                                Complete
                              </Button>
                              <Button colorScheme='blue' mr={3} onClick={onCompleteClose} >
                                Close
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
    </div>
  );
};

export default MyPosts;
