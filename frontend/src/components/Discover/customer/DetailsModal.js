import { Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react';
import bizimg from "../businessimg.jpeg"

const DetailsModal = ({ post, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{post.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            height="150px"
            borderRadius="md"
            src={post.postPic} // Replace with your post image URL
            alt={post.title}
          />
          <VStack align="start" spacing={3} mt={4}>
            <Text fontWeight="bold">Posted by: {post.user}</Text>
            <Text>Postal Code: {post.postalCode}</Text>
            <Text>Price: {post.price}</Text>
            <Text>Description: {post.description}</Text>
            <Text>Location: {post.location.lat}, {post.location.lon}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
