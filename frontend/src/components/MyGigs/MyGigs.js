import React, { useEffect, useState, useContext } from 'react';
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
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(); // Assume Firebase is already initialized

const MyGigs = () => {
  const user = useContext(UserContext);
  const [gigs, setGigs] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("request-gig");

  const filterPostsByStatus = (status) => {
    setFilteredStatus(status);
  };


  useEffect(() => {
    const fetchUserGigs = async () => {
      try {

        const response = await axios.get(`http://localhost:3000/api/gigs/users/${user.uid}/gigs`);
        const gigsData = await Promise.all(
          response.data.map(async (gig) => {
            // console.log(gig)
            // console.log(post);
            // console.log(gig.post.title);
            return { ...gig};
          })
        );
        setGigs(gigsData);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    fetchUserGigs()
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
          <Button colorScheme="teal" onClick={() => filterPostsByStatus("requested")}>
            Requested
          </Button>
          <Button colorScheme="red" onClick={() => filterPostsByStatus("pending")}>
            Pending
          </Button>
          <Button colorScheme="teal" onClick={() => filterPostsByStatus("completed")}>
            Completed
          </Button>
        </Stack>
      </Box>
      <Text mt={10} position="fixed" top={180} left={0} right={0} textAlign="center" fontSize="xl" fontWeight="bold">
        {filteredStatus.charAt(0).toUpperCase() + filteredStatus.slice(1)}
      </Text>

      {gigs.filter((gig) => gig.status === filteredStatus).length > 0 && (
        <div className="post-container">
          <Box display="flex" flexWrap="wrap">
            {gigs
              .filter((gig) => gig.status === filteredStatus)
              .map((gig) => (
                <Card key={gig.id} maxW="sm" flex="none" width="250px" m={6}>
                  <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                    <CardBody>
                      <Stack mt="6" spacing="4">
                        <Heading size="lg">Gig GID: {gig.gid}</Heading>
                        <Text fontSize="lg">Status: {gig.status}</Text>
                        <Text color="blue.600" fontSize="xl">
                          Post ID: {gig.post._path.segments[1]}
                        </Text>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      {/* <ButtonGroup spacing="2" margin="10px" >
                        <Button onClick={onOpen} variant="solid" colorScheme="blue" ml={gig.status === "requested" || gig.status === "completed" ? "50px" : "flex-start"} >
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
                            <ModalHeader>{gig.title}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Text>Description: {gig.post.title}</Text>
                              <Text>GID: {gig.gid}</Text>
                              <Text>Post: ${gig.post.title}</Text>
                            </ModalBody>

                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        {gig.status === "requested" && (
                          <Button variant="solid" colorScheme="teal">
                            Complete
                          </Button>
                        )}
                      </ButtonGroup> */}
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

export default MyGigs;