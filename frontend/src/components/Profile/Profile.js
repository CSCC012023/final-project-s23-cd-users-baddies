import React, { useContext, useEffect, useState, useRef } from 'react'; import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Heading,
  VStack,
  Input,
  Button,
  Select,
  useToast, Grid, FormControl, Avatar, Center, FormLabel, Textarea
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiMenu,
  FiAtSign, FiBookOpen
} from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const DateButton = ({ label, onClick }) => {
  return (
    <Button justifyContent="flex-start" width="100%" minWidth="40" onClick={onClick}>
      {label}
    </Button>
  );
};

const Profile = () => {

  const LinkItems = [
    { name: 'Personal Info', icon: FiHome, content: PersonalInfoTab },
    { name: 'Business Info', icon: FiTrendingUp, content: BusinessInfoTab, isBusiness: true },
    { name: 'Support', icon: FiAtSign, content: SupportTab },
    { name: 'Privacy Policy', icon: FiBookOpen, content: PrivacyPolicyTab },
    { name: 'Logout', icon: FiStar, content: LogoutTab },
  ];
  const user = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast(); // Add this to display the toast notifications
  const { isOpen, onOpen, onClose } = useDisclosure();

  const firebaseConfig = {
    apiKey: 'AIzaSyB-vRFrtFhIbXw2NHMj8VfBvi2iMU4kxwE',
    authDomain: 'cd-user-baddies.firebaseapp.com',
    projectId: 'cd-user-baddies',
    storageBucket: 'cd-user-baddies.appspot.com',
    messagingSenderId: '984565407792',
    appId: '1:984565407792:web:5c6ee1f310aec572c34df5',
    measurementId: 'G-4026EEFZZ3',
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const fileInputRef = useRef(null);
  const storage = getStorage(app);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleSavePersonalInfo = async (name, number) => {
    if (name === '' || number === '') {
      toast({
        title: 'Fields can\'t be empty',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    const userRef = doc(db, 'User', auth.currentUser.uid);

    const userData = {
      Name: name,
      contactNumber: number,
    };

    await updateDoc(userRef, userData);

    toast({
      title: 'Personal info saved successfully',
      status: 'success',
      duration: 1000,
      isClosable: true,
    });
  };

  const handleSaveBusinessInfo = async (name, description, businessHours) => {
    const userRef = doc(db, 'User', auth.currentUser.uid);

    const userData = {
      Business: {
        Name: name,
        Description: description,
        Hours: businessHours,
      },
    };

    await updateDoc(userRef, userData, { merge: true });

    toast({
      title: 'Business info saved successfully',
      status: 'success',
      duration: 1000,
      isClosable: true,
    });
  };

  function PersonalInfoTab() {
    const [name, setName] = useState(user.Name);
    const [number, setNumber] = useState(user.contactNumber);
    const [avatarImage, setAvatarImage] = useState(user.profilePicture);
    const handleSave = () => {
      handleSavePersonalInfo(name, number);
    };
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];

      // Check if the file is an image (JPEG, PNG, GIF)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        console.log('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }
      try {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('Download URL:', downloadURL); // Add this line to log the download URL

        // Update the user document in Firestore with the profilePicture field
        const userDocRef = doc(db, 'User', auth.currentUser.uid);
        await setDoc(
          userDocRef,
          {
            profilePicture: downloadURL,
          },
          { merge: true }
        );

        console.log('Profile picture updated successfully.'); // Add this line to log success

        // Update the Avatar with the new image
        setAvatarImage(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    return (
      <Flex direction="column" mt="24" mb={8}>
        <Center>
          <Avatar
            bg="blue.300"
            size="xl"
            name="Business"
            src={avatarImage || "path-to-avatar-image"} />

        </Center>
        <Button onClick={() => fileInputRef.current.click()}>Upload Picture</Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <Text fontWeight="bold" mb={2}>
          Full Name
        </Text>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Text fontWeight="bold" mb={2} mt={4}>
          Number
        </Text>
        <Input
          colorScheme="white"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <Button mt={4} colorScheme="blue" onClick={handleSave}>
          Save
        </Button>
      </Flex>
    );
  }

  function BusinessInfoTab() {
    const [businessName, setBusinessName] = useState(user.Business?.Name || '');
    const [businessDescription, setBusinessDescription] = useState(
      user.Business?.Description || ''
    );
    const [businessHours, setBusinessHours] = useState(
      user.Business?.Hours || {
        Monday: { isClosed: false, startHour: null, endHour: null },
        Tuesday: { isClosed: false, startHour: null, endHour: null },
        Wednesday: { isClosed: false, startHour: null, endHour: null },
        Thursday: { isClosed: false, startHour: null, endHour: null },
        Friday: { isClosed: false, startHour: null, endHour: null },
        Saturday: { isClosed: false, startHour: null, endHour: null },
        Sunday: { isClosed: false, startHour: null, endHour: null },
      }
    );
    const [selectedDay, setSelectedDay] = useState(null);

    const handleDateButtonClick = (day) => {
      setSelectedDay(day);
    };

    const handleCheckClosed = (day) => {
      const isDayClosed = isClosed(day);
      setBusinessHours((prevHours) => ({
        ...prevHours,
        [day]: {
          ...prevHours[day],
          isClosed: !isDayClosed,
        },
      }));
    };

    const formatHour = (hour) => (hour ? `${hour}:00` : '');

    const isClosed = (day) => businessHours[day]?.isClosed;

    const handleSave = () => {
      const hasInvalidHours = Object.values(businessHours).some(
        (hour) =>
          !hour.isClosed &&
          (hour.startHour === null || hour.endHour === null)
      );

      if (hasInvalidHours) {
        toast({
          title: "Hours can't be empty",
          status: 'error',
          duration: 1000,
          isClosable: true,
        });
      } else {
        handleSaveBusinessInfo(businessName, businessDescription, businessHours);
      }
    };

    return (
      <>
        <Flex direction="column" mt="24" mb={4}>
          <Text fontWeight="bold" mb={2}>
            Business Name
          </Text>
          <Input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </Flex>
        <Flex direction="column" mb={4}>
          <Text fontWeight="bold" mb={2}>
            Business Description
          </Text>
          <Input
            type="text"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
          />
        </Flex>
        <Text fontWeight="bold" mb={2}>
          Rating
        </Text>
        <Text>{user.Rating}</Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={10}>
          <VStack>
            {Object.keys(businessHours).map((day) => (
              <Flex key={day} justifyContent="space-between" width="100%">
                <DateButton
                  label={day}
                  onClick={() => handleDateButtonClick(day)}
                />
                <IconButton
                  icon={isClosed(day) ? <CloseIcon /> : <CheckIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCheckClosed(day)}
                />
              </Flex>
            ))}
          </VStack>
          <VStack>
            <Text fontWeight="bold" mb={2}>
              Business Hours
            </Text>
            {Object.keys(businessHours).map((day) => (
              <Flex key={day} flexDirection="column">
                <Text fontSize="lg">{day}</Text>
                {selectedDay === day && !isClosed(day) ? (
                  <Flex flexDirection="row" justifyContent="space-between">
                    <Select
                      placeholder="Start Hour"
                      value={businessHours[selectedDay]?.startHour || ''}
                      onChange={(e) =>
                        setBusinessHours((prevHours) => ({
                          ...prevHours,
                          [selectedDay]: {
                            ...prevHours[selectedDay],
                            startHour: e.target.value,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}:00
                        </option>
                      ))}
                    </Select>
                    <Select
                      placeholder="End Hour"
                      value={businessHours[selectedDay]?.endHour || ''}
                      onChange={(e) =>
                        setBusinessHours((prevHours) => ({
                          ...prevHours,
                          [selectedDay]: {
                            ...prevHours[selectedDay],
                            endHour: e.target.value,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}:00
                        </option>
                      ))}
                    </Select>
                  </Flex>
                ) : (
                  <Text fontSize="md">
                    {isClosed(day)
                      ? 'Closed'
                      : `${formatHour(businessHours[day]?.startHour)} - ${formatHour(
                        businessHours[day]?.endHour
                      )}`}
                  </Text>
                )}
              </Flex>
            ))}
          </VStack>
        </Grid>
        <Flex mt={4} justifyContent="center">
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </>
    );

  }


  function LogoutTab() {
    return (
      <Flex direction="column" mt="24">

        <Button colorScheme="red" mt={4} onClick={handleSignOut}>
          Sign out
        </Button>
      </Flex>
    );
  }
  function SupportTab() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const docRef = await addDoc(collection(db, 'Support'), {
          email,
          name,
          description,
          createdAt: serverTimestamp(),
        });

        toast({
          title: 'Support ticket created',
          description: `Ticket ID: ${docRef.id}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setEmail('');
        setName('');
        setDescription('');
      } catch (error) {
        console.error('Error creating support ticket: ', error);
        toast({
          title: 'An error occurred',
          description: 'Failed to create support ticket. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    return (
      <Flex direction="column" mt="24">
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="name" mt={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl id="description" mt={4} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <Button type="submit" mt={4} colorScheme="blue">
            Submit
          </Button>
        </form>
      </Flex>
    );
  }
  function PrivacyPolicyTab() {
    return (
      <Box mt="24">
        <Heading as="h2" size="xl" mb={4}>
          Privacy Policy
        </Heading>
        <Text>
          At BizReach, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our platform.
        </Text>
        <Text mt={4}>
          <strong>Information we collect:</strong> When you use BizReach, we may collect certain personally identifiable information
          from you, including your name, email address, phone number, and location. We also collect non-personal information like
          browsing activity and device information.
        </Text>
        <Text mt={4}>
          <strong>How we use your information:</strong> We may use the information we collect from you to provide and improve our
          services, respond to customer inquiries and support requests, personalize user experiences, and more.
        </Text>
        <Text mt={4}>
          <strong>How we disclose your information:</strong> We may share your information with third-party service providers who
          help us with various aspects of our operations. We may also disclose your information if required by law or to protect our
          rights or the rights of others.
        </Text>
        <Text mt={4}>
          <strong>How we protect your information:</strong> We have implemented appropriate security measures to protect your
          information from unauthorized access, alteration, and disclosure.
        </Text>
        <Text mt={4}>
          <strong>Third-party websites:</strong> Our platform may contain links to third-party websites. We have no control over
          and are not responsible for the privacy practices of such websites.
        </Text>
        <Text mt={4}>
          <strong>Updates to the Privacy Policy:</strong> We may update our Privacy Policy from time to time. Any changes will be
          posted on this page.
        </Text>
        <Text mt={4}>
          By using BizReach, you consent to our Privacy Policy and agree to its terms. If you have any questions or concerns about
          our Privacy Policy, please contact us.
        </Text>
      </Box>
    );
  }

  function SidebarContent({ onClose, ...rest }) {
    const user = useContext(UserContext);
    const userType = user.userType;

    return (
      <Box
        borderRight="1px"
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link, index) => {
          if (link.isBusiness && userType !== 'business') {
            return null;
          }

          return (
            <NavItem key={index} icon={link.icon} onClick={() => setActiveTab(index)}>
              {link.name}
            </NavItem>
          );
        })}
      </Box>
    );
  }

  function NavItem({ icon, children, onClick, ...rest }) {
    return (
      <Box
        as="button"
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        onClick={onClick}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          fontSize="20"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    );
  }

  function MobileNav({ onOpen, ...rest }) {
    return (
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 24 }}
        height="20"
        alignItems="center"
        borderBottomWidth="1px"
        justifyContent="flex-start"
        {...rest}
      >
        <IconButton
          variant="outline"
          onClick={onOpen}
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        {activeTab < LinkItems.length && React.createElement(LinkItems[activeTab].content)}
      </Box>
    </Box>
  );
};

export default Profile;
