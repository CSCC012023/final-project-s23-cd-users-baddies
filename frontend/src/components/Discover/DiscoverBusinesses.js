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
} from '@chakra-ui/react';
import axios from 'axios';
import './Discover.css';
import bisimg from './businessimg.jpeg';

const DiscoverBusinesses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    // Fetch businesses data from the server
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/business/');
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

  return (
    <div className="bodyy">
      <h1 className="title">Discover Businesses</h1>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {businesses.map((business) => (
          <GridItem key={business.uid}>
            <Box
              maxW="400px"
              maxH="400px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
            >
              <img src={bisimg} alt={business.Name} />
              <Box p="6">
                <Box d="flex" alignItems="baseline">
                  <Text fontWeight="semibold" fontSize="xl">
                    {business.Business?.Name}
                  </Text>
                </Box>
                <Box mt="1" fontSize="sm">
                  Location: {business.Location}
                </Box>
                <Button mt="2" onClick={() => handleBusinessClick(business)}>
                  Details
                </Button>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedBusiness?.Name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={bisimg} alt={selectedBusiness?.Name} />
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DiscoverBusinesses;

