import React, { useState, useContext, useEffect } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Input,
  FormControl,
  Button,
  Select,
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import ProfilePicture from './Profile pic.jpeg';



const Profile = () => {
  const LinkItems = [
    { name: 'Personal Info', icon: FiHome, content: PersonalInfoTab },
    { name: 'Business Info', icon: FiTrendingUp, content: BusinessInfoTab, isBusiness: true },
    { name: 'Logout', icon: FiStar, content: LogoutTab },
  ];
  const user = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleSavePersonalInfo = async (name, number) => {
    if (name === '' || number === '') {
      alert('Fields cannot be empty');
      return;
    }

    const userRef = doc(db, 'Users', auth.currentUser.uid);

    const userData = {
      Name: name,
      contactNumber: number,
    };

    await updateDoc(userRef, userData);

    alert('Personal info saved successfully');
  };

  const handleSaveBusinessInfo = async (name, description, businessHours) => {
    const userRef = doc(db, 'Users', auth.currentUser.uid);

    const userData = {
      Business: {
        Name: name,
        Description: description,
        Hours: businessHours,
      },
    };

    await updateDoc(userRef, userData);

    alert('Business info saved successfully');
  };

  function PersonalInfoTab() {
    const [name, setName] = useState(user.Name);
    const [number, setNumber] = useState(user.contactNumber);

    const handleSave = () => {
      handleSavePersonalInfo(name, number);
    };

    return (
      
      <Flex direction="column" mt="24"  mb={8}>
        <Text fontWeight="bold" mb={2}>
          Full Name
        </Text>
        <Input
          colorScheme="gray"
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
    const [businessDescription, setBusinessDescription] = useState(user.Business?.Description || '');
    const [businessHours, setBusinessHours] = useState(user.Business?.Hours || {});

    const handleSave = () => {
      handleSaveBusinessInfo(businessName, businessDescription, businessHours);
    };

    return (
      <>
        <Flex direction="column"  mt="24" mb={4}>
          <Text fontWeight="bold" mb={2}>
            Business Name
          </Text>
          <Input
            colorScheme="gray"
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
            colorScheme="gray"
            type="text"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
          />
        </Flex>
                <Text fontWeight="bold" mb={2}>
          Rating
        </Text>
        <Text>{user.Rating}</Text>
        <FormControl mt="3%">
          <Text as="h3" size="m" pb="10px" textAlign="left" mb="-15">
            Business Hours
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {Object.keys(businessHours).map((day) => {
              const startHour = businessHours[day]?.startHour || '00:00';
              const endHour = businessHours[day]?.endHour || '23:00';

              return (
                <GridItem key={day}>
                  <Flex flexDirection="column">
                    <Text>{day}</Text>
                    <Flex flexDirection="row" justifyContent="space-between">
                      <Select
                        placeholder="Start Hour"
                        defaultValue={startHour}
                        onChange={(e) =>
                          setBusinessHours((prevHours) => ({
                            ...prevHours,
                            [day]: { ...prevHours[day], startHour: e.target.value },
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
                        defaultValue={endHour}
                        onChange={(e) =>
                          setBusinessHours((prevHours) => ({
                            ...prevHours,
                            [day]: { ...prevHours[day], endHour: e.target.value },
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
                  </Flex>
                </GridItem>
              );
            })}
          </Grid>
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleSave}>
          Save
        </Button>
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
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
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
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
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
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
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
