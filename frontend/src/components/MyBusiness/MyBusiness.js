import React, { useState, useContext, useEffect } from 'react';
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
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Flex,
  Icon,
  IconButton,
  CloseButton,
} from '@chakra-ui/react';import { FiHome, FiUsers, FiStar, FiCalendar } from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import axios from 'axios';
import ServiceCard from './ServiceCard/ServiceCard';


const MyBusiness = () => {

  const LinkItems = [
    { name: 'Services', icon: FiHome, content: ServicesTab },
    { name: 'Schedule', icon: FiCalendar, content: ScheduleTab },
    { name: 'Clients', icon: FiUsers, content: ClientsTab },
    { name: 'Reviews', icon: FiStar, content: ReviewsTab },
  ];

  const user = useContext(UserContext);
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

  // Function for rendering the sidebar content
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
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
      serviceName: '',
      description: '',
      price: '',
      duration: '',
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
  
    const handleAddService = async () => {
      try {
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

  function ScheduleTab () {

  }

  function ClientsTab () {

  }

  function ReviewsTab () {

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
