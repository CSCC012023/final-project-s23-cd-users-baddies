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
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const isValidPostalCode = (postalCode) => {
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return postalCodeRegex.test(postalCode);
  };
  const isNumeric = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidPostalCode(postalCode)) {
      toast({
        title: "Invalid postal code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!isNumeric(price)) {
      toast({
        title: "Price must be a number.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      // Fetch coordinates from the location
      fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + postalCode + '&key=AIzaSyAWgPNBM-zYLfCEsVdAvaIrfgZBOXWoQhw')
        .then(response => response.json())
        .then(async data => {
          console.log(data)
          const lat = data.results[0].geometry.location.lat;
          const lon = data.results[0].geometry.location.lng;
          // Make a POST request to the backend API
          const res = await fetch(`http://localhost:3000/api/posts/users/${user.uid}/posts`, {
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

          }
          );
          if (res.ok) {
            toast({
              title: "Posted!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
          else {
            toast({
              title: "Error posting :(",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
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
        paddingTop={100}
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



            <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
              Postal code
            </Text>


            <FormControl>
              <InputGroup>
                <Input placeholder="Postal code" pr="180px" pt='0%' mt='1%'
                  value={postalCode} onChange={e => setPostalCode(e.target.value)} />
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



