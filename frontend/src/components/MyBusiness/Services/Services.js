import React, { useState, useContext, useEffect, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  Center,
  Avatar, 

} from '@chakra-ui/react';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import { UserContext } from '../../User/UserContext';
import { backendUrl } from '../../../config';


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
      servicePic: ''
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useContext(UserContext);
  
    useEffect(() => {
      fetchUserServices();
    }, []);
  
    const fetchUserServices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/services/${user.uid}`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
  
    const handleAddService = async () => {

      

      try {
        
        const response = await axios.post(`${backendUrl}/api/users/services/${user.uid}`, newService);
        console.log(response.data);
        onClose();
        fetchUserServices();
      } catch (error) {
        console.error('Error adding service:', error);
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

export default ServicesTab;