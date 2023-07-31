import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../User/UserContext';
import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, VStack, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import SimpleSidebar from './SideBarNav';
import ServiceCard from './ServiceCard/ServiceCard';
import Schedule from './Schedule/Schedule';
import Statistics from './Statistics/Statistics'
import Reviews from './Reviews/Reviews';
import Clients from './Clients/Clients'



const MyBusiness = () => {
  const user = useContext(UserContext);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('Services');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    duration: '',
  });

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setNewService({ ...newService, [name]: value });
  };

  const fetchUserServices = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/services/${user.uid}`);
      const userServices = response.data;
      setServices(userServices);
    } catch (error) {
      console.error('Error fetching user services:', error);
    }
  };


  const handleAddService = async () => {
    try {

      const response = await axios.post(`http://localhost:3000/api/users/services/${user.uid}`, newService);
      console.log(response.data); // Log the response from the backend (optional)
      onClose();
      fetchUserServices();

    } catch (error) {

      console.error('Error adding service:', error);
      
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Make a request to fetch the user profile using the provided API route for getting the profile by userID
        const response = await axios.get(`http://localhost:3000/api/users/profile/${user.uid}`);
        const userProfile = response.data;

        if (userProfile.userType === 'business' && userProfile.Business) {
        } else {
          setBusinessName('Not a business');
          setBusinessDescription('');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/users/services/${user.uid}`);
        const userServices = response.data;
        setServices(userServices);
      } catch (error) {
        console.error('Error fetching user services:', error);
      }
    };

    fetchUserProfile();
  }, [user.uid]);

  return (
    <div>
      <Flex>
        <SimpleSidebar activeTab={activeTab} handleTabClick={setActiveTab} />
        <Box ml="20px">
          {/* Render different content based on the active tab */}
          {activeTab === 'Services' ? (
            <Box mt="100px" display="flex" flexWrap="wrap">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  name={service.serviceName}
                  description={service.description}
                  price={service.price}
                  duration={service.duration}
                />
              ))}
            </Box>
          ) : activeTab === 'Schedule' ? (
            <Schedule />
          ) : activeTab === 'Statistics' ? (
            <Statistics />
          ) : activeTab === 'Clients' ? (
            <Clients />
          ) : activeTab === 'Reviews' ? (
            <Reviews />
          ) : (
            <Box>
              {/* Render a default content or leave this section empty */}
            </Box>
          )}
        </Box>
      </Flex>
      {/* Add Service Button */}
      {activeTab === 'Services' && (
        <Button
          onClick={onOpen}
          position="fixed"
          bottom="40px"
          right="40px"
          colorScheme="blue"
          size="lg"
        >
          Add Service
        </Button>
      )}

      {/* Modal for adding a new service */}
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
    </div>
  );
};

export default MyBusiness;
