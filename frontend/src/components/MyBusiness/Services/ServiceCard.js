import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Card,
  Image,
  Text,
  Heading,
  Divider,
  Button,
  ButtonGroup,
  Stack,
  CardBody,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { UserContext } from '../../User/UserContext';

function ServiceCard({ serviceId,name, description, price, duration, servicePic, onDeleteService }) {
  const [editedService, setEditedService] = useState({
    serviceName: name,
    description: description,
    price: price,
    duration: duration,
    servicePic: servicePic,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState('');

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {

      const response = await axios.delete(
        `http://localhost:3000/api/users/services/${user.uid}/${serviceId}`
      );

      console.log(response.data);

      onDeleteService(serviceId)
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };




  const handleOpenEditModal = () => {
    setIsOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedService({ ...editedService, [name]: value });
  };
  
  const user = useContext(UserContext)
  
  const handleSaveChanges = async () => {
  
    try {
      const updatedServiceData = {
        serviceName: editedService.serviceName,
        description: editedService.description,
        price: editedService.price,
        duration: editedService.duration,
      };

      

      // Make the PUT request to update the service
      // console.log(user)
      const response = await axios.put(
        `http://localhost:3000/api/users/services/${user.uid}/${serviceId}`,
        updatedServiceData
      );

      // console.log(response.data); // Log the response from the backend (optional)

      // Close the modal and do any other necessary actions
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating service:', error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  return (
    <Card w="350px" maxW="sm" m="10px">
      <CardBody>
        <Image
          src={editedService.servicePic ? editedService.servicePic : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
          alt="Service"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{editedService.serviceName}</Heading>
          <Text>{editedService.description}</Text>
          <Text color="blue.600" fontSize="2xl">
            ${editedService.price}
          </Text>
          <Text>Duration: {editedService.duration}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="ghost" colorScheme="blue" onClick={handleOpenEditModal}>
            Edit
          </Button>
          <Button variant="solid" colorScheme="blue" onClick={handleOpenDeleteModal}>
            Delete
          </Button>
        </ButtonGroup>
      </CardFooter>

      <Modal isOpen={isOpen} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Service Name</FormLabel>
                <Input
                  type="text"
                  name="serviceName"
                  value={editedService.serviceName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={editedService.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input type="number" name="price" value={editedService.price} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <Input type="text" name="duration" value={editedService.duration} onChange={handleInputChange} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this service?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}

export default ServiceCard;
