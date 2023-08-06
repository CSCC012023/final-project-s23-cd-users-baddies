import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import getAddressFromCoordinates from '../../utils/utils';
import {
  Card,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  Divider,
  useDisclosure
} from "@chakra-ui/react";
import axios from 'axios';
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { backendUrl } from '../../config';

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
        const response = await axios.get(`${backendUrl}/api/gigs/users/${user.uid}/gigs`);
        const gigsData = await Promise.all(
          response.data.map(async (gig) => {
            const postRef = doc(db, gig.post._path.segments[0], gig.post._path.segments[1]);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();
            return { ...gig, post: postData };
          })
        );
        setGigs(gigsData);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    fetchUserGigs()
  }, [user.uid]);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Button colorScheme="red" onClick={() => filterPostsByStatus("in-progress")}>
            In-Progress
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
          <Box display="flex" flexWrap="wrap" justifyContent="center" marginTop="60">
            {gigs
              .filter((gig) => gig.status === filteredStatus)
              .map((gig) => (
                <Card key={gig.id} maxW="sm" flex="none" width="250px" m={6}>
                  <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                    <Box p={4}>
                      <Heading size="lg">Title: {gig.post.title}</Heading>
                      <Text fontSize="sm" mb={1}>Status: {gig.status}</Text>
                      <Text fontSize="sm" mb={1}>Title: {gig.post.title}</Text>
                      <Text fontSize="sm" mb={1}>Description: {gig.post.description}</Text>
                      <Text fontSize="sm" mb={1}>Price: ${gig.post.price}</Text>
                    </Box>
                    <Divider />
                    <Box p={4}>
                      {/* Place additional buttons or actions here */}
                    </Box>
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
