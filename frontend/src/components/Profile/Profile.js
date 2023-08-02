import React, { useState, useContext, } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Spacer,
  VStack,
  Input,
  Button,
  Select,
  useToast, Grid, GridItem
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiMenu,
} from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
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

    await updateDoc(userRef, userData);

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

    const handleSave = () => {
      handleSavePersonalInfo(name, number);
    };

    return (

      <Flex direction="column" mt="24" mb={8}>
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
