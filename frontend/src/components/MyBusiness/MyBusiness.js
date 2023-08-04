import React, { useState, useContext, useEffect, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  ChakraProvider,
  Textarea,
  Drawer,
  DrawerContent,
  Box,
  Text,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Center,
  Avatar,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Flex,
  Icon,
  IconButton,
  CloseButton,
} from '@chakra-ui/react'; import { FiHome, FiUsers, FiStar, FiCalendar } from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import ReviewsTab from './Reviews/Reviews';
import ServicesTab from './Services/Services';
import axios from 'axios';
import ServiceCard from './Services/ServiceCard'
import ClientCard from './Clients/Clients';


const MyBusiness = () => {

  const LinkItems = [
    { name: 'Services', icon: FiHome, content: ServicesTab },
    { name: 'Schedule', icon: FiCalendar, content: ScheduleTab },
    { name: 'Clients', icon: FiUsers, content: ClientsTab },
    { name: 'My Reviews', icon: FiStar, content: ReviewsTab },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function for handling the navigation items in the sidebar
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

  function ServicesTab() {

    const [avatarImage, setAvatarImage] = useState(null);
    const fileInputRef = useRef(null);
    const storage = getStorage();

    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
      serviceName: '',
      description: '',
      price: '',
      duration: '',
      servicePic:'',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useContext(UserContext);

    useEffect(() => {
      fetchUserServices();
    }, []);

    const fetchUserServices = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/services/${user.uid}`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
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
        const storageRef = ref(storage, `postImages/${file.name}`);
        await uploadBytes(storageRef, file);
  
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
  
        // Set the avatarImage state to the download URL
        setAvatarImage(downloadURL);
  
        // Call handleFormInputChange with the updated URL
        handleFormInputChange({
          target: {
            name: 'servicePic',
            value: downloadURL,
          },
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const handleAddService = async () => {

      try {
        console.log(avatarImage)

        if (avatarImage) {
          setNewService({ ...newService, servicePic: avatarImage }); // Set servicePic to the download URL
        }
        console.log(newService)

        const response = await axios.post(`http://localhost:3000/api/users/services/${user.uid}`, newService);
        console.log(response.data);
        onClose();
        fetchUserServices();
      } catch (error) {
        console.error('Error adding service:', error);
      }
    };

    const handleFormInputChange = (event) => {
      const { name, value } = event.target;
      setNewService({ ...newService, [name]: value });
    };

    return (
      <Box>
        <Box mt="90px">
          <Flex flexWrap="wrap" justifyContent="flex-start">
            {services.map((service) => (
              <ServiceCard
                key={service.serviceId}
                user={user}
                serviceId={service.serviceId}
                name={service.serviceName}
                description={service.description}
                price={service.price}
                duration={service.duration}
                servicePic={service.servicePic}
                onDeleteService={fetchUserServices}
              />
            ))}
          </Flex>
        </Box>
        <Box position="fixed" bottom="4" right="4">
          {/* Add Service Button */}
          <Button onClick={onOpen} colorScheme="blue">
            Add Service
          </Button>
        </Box>

        {/* Add Service Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Service Name</FormLabel>
                  <Input
                    type="text"
                    name="serviceName"
                    value={newService.serviceName}
                    onChange={handleFormInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={newService.description}
                    onChange={handleFormInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={handleFormInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Duration</FormLabel>
                  <Input
                    type="text"
                    name="duration"
                    value={newService.duration}
                    onChange={handleFormInputChange}
                  />
                </FormControl>
                <Center>
              <Avatar
                  bg="blue.300"
                  size="2xl"
                  name="Business"
                  borderRadius="0"
                  src={avatarImage || "path-to-avatar-image"}/>
                </Center>
                <Center>
                <Button w="100%" bg="blue.200" onClick={() => fileInputRef.current.click()}>Upload Picture</Button>
                </Center>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handleAddService}>
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  function ScheduleTab() {

  }

  function ClientsTab() {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
      clientName: '',
      lastDealTimestamp: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useContext(UserContext);

    useEffect(() => {
      fetchUserClients();
    }, []);

    const fetchUserClients = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/clients/${user.uid}`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    return (
      <Box>
        <Box mt="90px">
          <Flex flexWrap="wrap" justifyContent="flex-start">
            {clients.map((client) => (
              <ClientCard/>
            ))}
          </Flex>
        </Box>
        <Box position="fixed" bottom="4" right="4">
        </Box>
      </Box>
    );
  }


  function ReviewsTab() {

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

      <Box ml={{ base: 0, md: 60 }} p="4">
        {activeTab < LinkItems.length && React.createElement(LinkItems[activeTab].content)}
      </Box>
    </Box>
  );
};

export default MyBusiness;
