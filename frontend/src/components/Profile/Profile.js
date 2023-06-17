import React, { useState, useContext } from 'react';
import { Box, Button, Flex, Image, Input, Text } from '@chakra-ui/react';
import { UserContext } from '../User/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import ProfilePicture from './Profile pic.jpeg'; // Import the profile picture

const Profile = () => {
  const user = useContext(UserContext);
  const [name, setName] = useState(user.Name);
  const [number, setNumber] = useState(user.contactNumber);

  const auth = getAuth();
  const db = getFirestore();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleSave = async () => {
    if (name === '' || number === '') {
      alert('Fields cannot be empty');
      return;
    }

    const userRef = doc(db, 'Users', auth.currentUser.uid);

    await updateDoc(userRef, {
      Name: name,
      contactNumber: number,
    });
  };

  return (
    <Flex justify="center" direction="column" mt={10}>
      <Text fontSize="4xl" fontWeight="bold" mb={4}>
        Welcome {user.Name}!
      </Text>
      <Flex align="center" mb={8}>
        <Flex direction="column" mr={6}>
          <Image src={ProfilePicture} alt="Profile" borderRadius="full" boxSize="200px" />
          <Button mt={4} colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </Flex>
        <Box>
          <Flex direction="column" mb={4}>
            <Text fontWeight="bold" mb={2}>
              Full Name
            </Text>
            <Input colorScheme="gray" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Flex>
          <Flex direction="column" mb={4}>
            <Text fontWeight="bold" mb={2}>
              Number
            </Text>
            <Input color="white" colorScheme="white" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
          </Flex>
          <Flex direction="column">
            <Text fontWeight="bold" mb={2}>
              Rating
            </Text>
            <Text>{user.Rating}</Text>
          </Flex>
        </Box>
      </Flex>
      <Button colorScheme="red" onClick={handleSignOut}>
        Sign out
      </Button>
    </Flex>
  );
};

export default Profile;
