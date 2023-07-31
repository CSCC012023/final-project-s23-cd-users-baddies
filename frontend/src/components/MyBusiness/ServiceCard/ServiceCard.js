import React from 'react';
import { Card, Image, Text, Heading, Divider, Button, ButtonGroup, Stack, CardBody, CardFooter } from '@chakra-ui/react';

function ServiceCard({ name, description, price, duration }) {
  return (
    <Card maxW='sm' m="10px">
      <CardBody>
        <Image
          src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
          alt='Service'
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{name}</Heading>
          <Text>{description}</Text>
          <Text color='blue.600' fontSize='2xl'>
            ${price}
          </Text>
          <Text>Duration: {duration}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing='2'>
          <Button variant='ghost' colorScheme='blue'>
            Edit
          </Button>
          <Button variant='solid' colorScheme='blue'>
            Delete
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
