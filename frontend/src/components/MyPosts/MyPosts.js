import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../User/UserContext';
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
} from "@chakra-ui/react";
import axios from 'axios';


const MyPosts = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("open");

  const filterPostsByStatus = (status) => {
    setFilteredStatus(status);
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log(user.uid)
        const response = await axios.get(`http://localhost:3000/api/posts/users/${user.uid}/posts`);
        setPosts(response.data);
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
          <Box display="flex" flexWrap="wrap">
            {posts
              .filter((post) => post.status === filteredStatus)
              .map((post) => (
                <Card key={post.id} maxW="sm" flex="1" mr={10} mb={4}>
                  <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                    <CardBody>
                      <Stack mt="6" spacing="3">
                        <Heading size="lg">{post.title}</Heading>
                        <Text fontSize="lg">Status: {post.status}</Text>
                        <Text color="blue.600" fontSize="xl">
                          ${post.price}
                        </Text>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <ButtonGroup spacing="2">
                        <Button variant="solid" colorScheme="blue">
                          Details
                        </Button>
                        <Button variant="solid" colorScheme="teal">
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
