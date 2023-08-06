import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import { UserContext } from '../User/UserContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Image,
  Avatar,
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
import { backendUrl } from '../../config';

// import logo from "../Home/assets/img/bizreach-logo.png";

const Post = () => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const toast = useToast(); // Add this to display the toast notifications
  const storage = getStorage();
  const user = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);
  const fileInputRef = useRef(null);
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

          if (avatarImage) {
            // Upload the image to Firebase Storage
            const storageRef = ref(storage, `postImages/${avatarImage.name}`);
            await uploadBytes(storageRef, avatarImage);
      
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);
      
            // Set the postPic to the download URL
            const postPic = avatarImage;
          

          
          // Make a POST request to the backend API
          const res = await fetch(`${backendUrl}/api/posts/users/${user.uid}/posts`, {
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
              postPic: postPic
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
          }}
        })
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // Check if the file is an image (JPEG, PNG, GIF)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `postImages/${file.name}`);
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Set the avatarImage state to the download URL
      setAvatarImage(downloadURL);
      console.log(downloadURL)
    } catch (error) {
      console.error('Error uploading image:', error);
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
        role: "system", content: "A user is trying to find a good description for a title he will provide you. He's posting a gig to look for someone to help him with a service, for example he might want someone to mow his lawn or clean up his driveway"
      }, { role: "user", content: `Hey, can you give me a better description, my current description is:,  and my title is Someone to mow my lawn` }, { role: "assistant", content: 'Looking for someone for regular lawn mowing at my property. Please reach out if you\'re a skilled lawn care provider.' }, { role: "user", content: `Hey, can you give me a better description, my current description is: ${description},  and my title is ${title}` }],
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
          <Heading >Need a service? Make a post!</Heading>
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

            <Center>
              <Avatar
                  bg="blue.300"
                  size="2xl"
                  name="Business"
                  borderRadius="0"
                  src={avatarImage || "path-to-avatar-image"}/>
                </Center>
                <Center>
                <Button w="50%" bg="blue.400" onClick={() => fileInputRef.current.click()}>Upload Picture</Button>
                </Center>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  />


            <Button
              borderRadius={0}
              type="submit"
              variant="solid"
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



