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

  const filterPostsByStatus = (status) => {
    setFilteredStatus(status);
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
        console.log(posts)
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
  
    fetchUserPosts();
  }, [user.uid]);
  
   
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <Box display="flex" flexWrap="wrap">
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
                        <Button onClick={onOpen} variant="solid" colorScheme="blue" ml={post.status === "posted" || post.status === "completed"? "50px" : "flex-start"} >
                          Details
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
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
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        {post.status === "in-progress" && (
                        <Button variant="solid" colorScheme="teal">
                          Complete
                        </Button>
                      )}
                      </ButtonGroup>
                    </CardFooter>
                  </Box>
                </Card>
              ))}
          </Box>
        </div>
      )}

      {/* Render the modal when modalShow is true
      {modalShow && (
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          post={selectedPost} // Pass the selected post as a prop to the modal
        />
      )} */}
    </div>
  );
};

export default MyPosts;
