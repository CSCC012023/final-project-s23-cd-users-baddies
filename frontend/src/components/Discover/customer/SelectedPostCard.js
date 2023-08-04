import React, { useRef, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Card, CardBody, CardFooter, Heading, Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import DetailsModal from './DetailsModal';
import bizimg from "../businessimg.jpeg"

const SelectedPostCard = ({ post, onButtonClick }) => {
  const cancelRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onConfirm = () => {
    onButtonClick(post);
    onClose();
  };

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const onDetailsClose = () => setIsDetailsOpen(false);
  console.log(post.postPic)

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '300px' }}
        src={post.postPic || bizimg}
        alt={post.title}
      />

      <Stack>
        <CardBody>
          <Heading size='xl'>{post.title}</Heading>
          <Text py='1'>Posted by: {post.user}</Text>
          <Text py='1'>Postal Code: {post.postalCode}</Text>
          <Text py='1'>Price: {post.price}</Text>
        </CardBody>

        <CardFooter>
          {post.isButtonClicked ? (
            <Tooltip label="Already Requested!" aria-label="A tooltip">
              <span>
                <Button variant='solid' colorScheme='blue' isDisabled>
                  Requested
                </Button>
              </span>
            </Tooltip>
          ) : (
            <>
              <Button variant='solid' colorScheme='blue' onClick={() => setIsOpen(true)}>
                Request Gig
              </Button>

              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Request Gig
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to request this gig?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        No
                      </Button>
                      <Button colorScheme="teal" onClick={onConfirm} ml={3}>
                        Yes
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
          <Button variant='solid' colorScheme='blue' onClick={() => setIsDetailsOpen(true)} ml={3}>
            See Details
          </Button>

          <DetailsModal post={post} isOpen={isDetailsOpen} onClose={onDetailsClose} />
        </CardFooter>
      </Stack>
    </Card>
  );
};

export default SelectedPostCard;



