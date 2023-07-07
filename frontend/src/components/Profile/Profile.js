import React, { useState, useContext } from 'react';
import { Box, Button, Flex, Image, Input, Text, Select, FormControl, Grid, GridItem } from '@chakra-ui/react';
import { UserContext } from '../User/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import ProfilePicture from './Profile pic.jpeg'; 

const Profile = () => {
  const user = useContext(UserContext);

  const userType = user.userType;
  const isBusiness = userType === 'business';
  const business = isBusiness ? user.Business || {} : {};
  const [businessHours, setBusinessHours] = useState(business.Hours);
  const [name, setName] = useState(user.Name);
  const [number, setNumber] = useState(user.contactNumber);
  const [businessName, setBusinessName] = useState(isBusiness ? (business.Name || '') : '');
  const [businessDescription, setBusinessDescription] = useState(isBusiness ? (business.Description || '') : '');
  

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

    let userData = {
      Name: name,
      contactNumber: number,
    };

    if (isBusiness) {
      userData = {
        ...userData,
        Business: {
          Name: businessName,
          Description: businessDescription,
          Hours: businessHours
        },
      };
    }

    await updateDoc(userRef, userData);
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
            <Input colorScheme="white" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
          </Flex>
          {isBusiness && (
            <>
              <Flex direction="column" mb={4}>
                <Text fontWeight="bold" mb={2}>
                  Business Name
                </Text>
                <Input colorScheme="gray" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </Flex>
              <Flex direction="column" mb={4}>
                <Text fontWeight="bold" mb={2}>
                  Business Description
                </Text>
                <Input colorScheme="gray" type="text" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} />
              </Flex>
              <FormControl mt="3%">
                <Text as="h3" size="m" pb="10px" textAlign="left" mb="-15">
                  Business Hours
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {Object.keys(businessHours).map((day) => (
                    <GridItem key={day}>
                      <Flex flexDirection="column">
                        <Text>{day}</Text>
                        <Flex flexDirection="row" justifyContent="space-between">
                          <Select placeholder="Start Hour" defaultValue={businessHours[day]? businessHours[day].startHour : ''} onChange={(e) => 
                            setBusinessHours((prevHours) => ({
                              ...prevHours,
                              [day]: { ...prevHours[day], startHour: e.target.value },
                            }))}>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}:00
                              </option>
                            ))}
                          </Select>
                          <Select placeholder="End Hour" defaultValue={businessHours[day]? businessHours[day].endHour : ''} onChange={(e) =>
                            setBusinessHours((prevHours) => ({
                              ...prevHours,
                              [day]: { ...prevHours[day], endHour: e.target.value },
                            }))}>
                            {Array.from({ length: 24 }, (_, i) => i+1).map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}:00
                              </option>
                            ))}
                          </Select>
                        </Flex>
                      </Flex>
                    </GridItem>
                  ))}
                </Grid>
              </FormControl>
            </>
          )}
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