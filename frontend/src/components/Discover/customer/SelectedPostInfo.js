import React from 'react';
import handlePostTransfer from './GoogleMap';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const SelectedPostInfo = ({ selectedPost }) => {
  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md">
      {!selectedPost ? (
        <Text>Select a post on the map</Text>
      ) : (
        <Box>
          <Heading as="h2" size="lg" mb={2}>
            {selectedPost.title}
          </Heading>
          <Text>Price: {selectedPost.price}</Text>
          <Text>Description: {selectedPost.description}</Text>
          <Text>
            Location: {selectedPost.location.lat}, {selectedPost.location.lon}
          </Text>
          {/* Button to grab the gig */}
          {!selectedPost.isButtonClicked && (
            <Button colorScheme="teal" mt={4} onClick={handlePostTransfer}>
              Grab Gig
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SelectedPostInfo;

