import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import { UserContext } from '../../User/UserContext';


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

export default ServicesTab;