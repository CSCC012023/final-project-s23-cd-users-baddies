import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
import { Button, Box, Divider } from "@chakra-ui/react";
import { getFirestore, doc, getDoc, updateDoc, arrayRemove} from "firebase/firestore";

const db = getFirestore(); // assume firebase is already initialized

const MyGigs = () => {
  const user = useContext(UserContext);
  const [Gigs, setGigs] = useState([]);

  const fetchGigs = async () => {
    const userRef = doc(db, 'Users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists() && userSnapshot.data().Gigs) {
      setGigs(userSnapshot.data().Gigs);
    }
  }

  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <Box maxW="sm" borderWidth={1} borderRadius="lg" overflow="hidden" mt={6}>
      <Box p="6">
        {Gigs.map((gig, index) => (
          <Box key={index} d="flex" alignItems="baseline" mb={4}>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
            >
              {gig.title}
            </Box>
            <Divider mt={2} mb={2} />
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
              Status: {gig.status}
            </Box>
            <Divider my={2} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MyGigs;