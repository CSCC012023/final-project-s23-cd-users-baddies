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
   useToast
} from "@chakra-ui/react";
import { FaMagic } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';

// import logo from "../Home/assets/img/bizreach-logo.png";

const Post = () => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const toast = useToast(); // Add this to display the toast notifications
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
            price: parseFloat(price), // Convert to a number
            location: { lat, lon },
            postalCode,
            status: 'posted',
            postedBy: `/User/${user.uid}`, // Reference to the user who created the post
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
  const handleWizard = async () => {
    console.log("hi")
    if (title === '') {
      toast({
        title: "Title can't be empty when wizarding",
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
      return;
    } console.log("hi")

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system", content: "A user is trying to find a good description for a title he will provide you. He's looking for an individual to accomplish what's being done in the title, this is being posted to platform where users can post a gig and businesses can pick it up. Simply respond with the better description, or a new one if no description is provided, nothing else."
      }, { role: "user", content: `Hey, can you give me a better description, my current description is:,  and my title is Someone to mow my lawn` }, { role: "assistant", content: 'Need someone reliable and efficient for regular lawn mowing at my property. Please reach out if you\'re a skilled lawn care provider.' }, { role: "user", content: `Hey, can you give me a better description, my current description is: ${description},  and my title is ${title}` }],
    });
    setDescription(chatCompletion.data.choices[0].message.content)
    console.log(chatCompletion.data.choices[0].message.content);
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
                  value={postalCode} onChange={e => setPostalCode(e.target.value)} />
              </InputGroup>
            </FormControl>

            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
              Title
            </Text>


            <FormControl>
              <InputGroup>
                <Input placeholder="Title" pr="180px" pt='0%' mt='1%'
                  value={title} onChange={e => setTitle(e.target.value)} />
              </InputGroup>
            </FormControl>

            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
              Description
            </Text>

            <FormControl>
      <InputGroup>
        <TextareaAutosize
          style={{
            paddingRight: '180px',
            paddingTop: '0%',
            marginTop: '1%',
            minWidth: '100%',
          }}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputRightElement>
          <Button onClick={handleWizard}>
            <FaMagic />
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>


            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
              Price
            </Text>


            <FormControl>
              <InputGroup>
                <Input placeholder="Price" pr="180px" pt='0%' mt='1%'
                  value={price} onChange={e => setPrice(e.target.value)} />
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



