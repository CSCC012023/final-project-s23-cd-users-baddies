import React from 'react';
import { Box, Heading, Container } from '@chakra-ui/react';
import GoogleMapContainer from './GoogleMap';

const DiscoverPosts = () => {
  return (
    <Container maxW="container.xl" py={6}>
      <Heading as="h1" mb={6} textAlign="center">
        Discover
      </Heading>
      <Box boxShadow="xl" p={5} rounded="md" bg="white" marginTop="10%">
        <GoogleMapContainer />
      </Box>
    </Container>
  );
};

export default DiscoverPosts;
