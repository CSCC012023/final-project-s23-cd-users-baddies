import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import { UserContext } from '../User/UserContext';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Image,
  Box,
  Link,
  Center,
  FormControl,
  FormHelperText,
  InputRightElement,
  Text,
  Checkbox
} from "@chakra-ui/react";
// import logo from "../Home/assets/img/bizreach-logo.png";

const Post = () => {
  const user = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch coordinates from the location
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();


      if (geocodeData && geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];

        // Make a POST request to the backend API
        const response = await fetch(`http://localhost:3000/api/posts/users/${user.uid}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            description,
            price,
            location: { lat, lon },
            postalCode,
          })
        });
        
        if (response.ok) {
          console.log('Post added successfully.');
          navigate('/');
        } else {
          console.error('Error adding post:', response.statusText);
        }
      } else {
        console.error('Could not geocode the location.');
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Need a service? Make a post!</Heading>
            <Stack
              p="1rem"
              // backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >


            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Postal code
                </Text>
  

             <FormControl>
                <InputGroup>
                <Input placeholder="Postal code" pr="180px" pt='0%' mt='1%' 
                value={postalCode} onChange={e => setPostalCode(e.target.value)}/>
                </InputGroup>
              </FormControl>

            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Title
              </Text>
  

             <FormControl>
                <InputGroup>
                <Input placeholder="Title" pr="180px" pt='0%' mt='1%'
                value={title} onChange={e => setTitle(e.target.value)}/>
                </InputGroup>
              </FormControl>

                <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Description
                </Text>
  

             <FormControl>
                <InputGroup>
                <Input placeholder="Description" pr="180px" pt='0%' mt='1%'
                value={description} onChange={e => setDescription(e.target.value)}/>
                </InputGroup>
              </FormControl>
              
           
             <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Price
                </Text>
  

             <FormControl>
                <InputGroup>
                <Input placeholder="Price" pr="180px" pt='0%' mt='1%'
                value={price} onChange={e => setPrice(e.target.value)}/>
                </InputGroup>
              </FormControl>
              <FormControl>


              <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Location
                </Text>
                <InputGroup>
                
                  <Input
                    placeholder="Location" mt='2%'
                    value={location} onChange={e => setLocation(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                  </InputRightElement>
                </InputGroup>
                </FormControl>
                

            <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                mt='5%'
  
              >
                Post

              </Button>
            </Stack>
      </Stack>
    </Flex>
    </form>
  );
};

export default Post;


