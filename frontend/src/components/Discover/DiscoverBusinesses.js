import React, { useEffect, useState } from 'react';
import {
  Image,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Box,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import bisimg from './businessimg.jpeg';
import { backendUrl } from '../../config';

const DiscoverBusinesses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 6;
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch businesses data from the server
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/businesses/`);
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    onOpen();
  };

  const handleViewServices = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/services/${selectedBusiness.uid}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Calculate the index range for the current page
  const lastIndex = currentPage * businessesPerPage;
  const firstIndex = lastIndex - businessesPerPage;
  const currentBusinesses = businesses.slice(firstIndex, lastIndex);

  // Calculate grid row and column for each business item
  const getGridRow = (index) => Math.floor(index / 3) + 1;
  const getGridColumn = (index) => index % 3 + 1;

  return (
    <Box p="4">
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb="4">
        Discover Businesses
      </Text>

      {/* Grid */}
      <Center>
        <Grid templateColumns="repeat(3, 1fr)" gap="4">
          {currentBusinesses.map((business, index) => (
            <GridItem key={business.uid} row={getGridRow(index)} col={getGridColumn(index)}>
              <Box
                maxW="350px"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                p="4"
              >
                <Center>
                  <Image h="120px" src={business.profilePicture || bisimg} alt={business.Name} />
                </Center>
                <Box p="6">
                  <Box d="flex" alignItems="baseline">
                    <Text fontWeight="semibold" fontSize="xl">
                      {business.Business?.Name}
                    </Text>
                  </Box>
                  <Box mt="1" fontSize="sm">
                    Location: {business.Location}
                  </Box>
                  <Button mt="2" colorScheme="blue" onClick={() => handleBusinessClick(business)}>
                    Details
                  </Button>
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Center>

      {/* Next and Previous Buttons */}
      <Box mt="4" textAlign="center">
        <Button
          colorScheme="blue"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Button
          ml="2"
          colorScheme="blue"
          disabled={lastIndex >= businesses.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedBusiness?.Name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image src={bisimg} alt={selectedBusiness?.Name} maxH="200px" />
            </Center>
            <Box mt="4">
              <Text fontSize="xl">Location: {selectedBusiness?.Location}</Text>
              <Text fontSize="xl">Description: {selectedBusiness?.Business?.Description}</Text>
              <Text fontSize="xl">Availability:</Text>
              {Object.entries(selectedBusiness?.Business?.Hours || {}).map(([day, hours]) => (
                <Text key={day}>
                  {day}: {hours?.startHour} - {hours?.endHour}
                </Text>
              ))}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleViewServices}>
              View Services
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Pop-up for viewing services */}
      <Modal isOpen={services.length > 0} onClose={() => setServices([])}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Services for {selectedBusiness?.Name}</ModalHeader>
          <ModalCloseButton />
          {services.length > 0 ? (
            // If services array is not empty, display the services
            <ModalBody>
              {services.map((service) => (
                <Box key={service.serviceId} mt="4">
                  <Text fontSize="xl">Service Name: {service.serviceName}</Text>
                  <Text fontSize="lg">Description: {service.description}</Text>
                  <Text fontSize="lg">Duration: {service.duration}</Text>
                  <Text fontSize="lg">Price: {service.price}</Text>
                </Box>
              ))}
            </ModalBody>
          ) : (
            // If services array is empty, display "No services available" message
            <ModalBody textAlign="center">
              <Text fontSize="xl" color="red">
                No services available
              </Text>
              <Button colorScheme="red" mt="4" onClick={() => setServices([])}>
                Close
              </Button>
            </ModalBody>
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setServices([])}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DiscoverBusinesses;
