import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../User/UserContext';
// import { Button, Box, Divider } from "@chakra-ui/react";
import { getFirestore, doc,setDoc, getDoc, updateDoc, arrayRemove ,arrayUnion} from "firebase/firestore";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Image,
  Box,

  ArrowLeftIcon,
  IconButton,
  Link,
  Center,
  FormControl,
  FormHelperText,
  InputRightElement,
  Text,
  Checkbox,
  Avatar
} from "@chakra-ui/react";


const SideBar = () => {

  const user = useContext(UserContext);

  return(
    <Flex
    h="100vh"
    w="50vh"
    borderEnd='1px solid'
    borderColor='#50545c'
    // borderEnd="1px solid" borderColor="gray.200"
    direction="column"
    
    
  >

    <Flex
    
    // bg="red.100"
    w="100%"
    h="20vh"
    align="center"
    borderBottom="1px solid"
    borderColor='#50545c'>
      
      <Avatar mt="75px" ml="20px" src={user.photoURL}></Avatar>

      <Flex 
      align="center" justifyContent={"space-between"} 
      mt="10vh" marginEnd={3} p='3'>
        <Text color='teal.400'>
          {user.Name}
        </Text>
      </Flex>

    </Flex>

    <Flex flexDirection={"column"} overflowX={"scroll"} sx={{scrollbarWidth: "0px"}} flex={1}>
      <Chat/>
      <Chat/>
      <Chat/>
      <Chat/>
      <Chat/>
      <Chat/>
      <Chat/>
      <Chat/>
    </Flex>
  </Flex>
  )
}

const Chat = () => {

  return(
    <Flex m='3'p={3} align={"center"} _hover={{bg:"teal.400", cursor:"pointer"}} >

      <Avatar src=""/>
      <Text ml="10px">User</Text>


    </Flex>
  )
}
const TopBar = () => {

  return(
    <Flex
    // bg="teal.100"
    w="100%"
    h="20vh"
    align="center"
    borderBottom="1px solid"
    borderColor='#50545c'
    >

      <Avatar mt='10vh' src="" ml='3'/>

      <Text color='white' align="center" justifyContent={"space-between"} 
        mt="10vh" marginEnd={3} p='3'>
            User
          </Text>


    </Flex>
  )
}

const BottomBar = () => {

  return(

    <FormControl padding={3} justifyContent={"space-between"} >

      <Input w="70%" placeholder='Type a message'/>

      <Button w="10%" type="submit" hidden>Send </Button>

      </FormControl>
  )
}

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatContacts, setChatContacts] = useState([]);

  // Fetch chat contacts from the API
  const user = useContext(UserContext);
  
  useEffect(() => {
    const fetchChatContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/messages/contacts/${user.uid}`,{
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
          const chatContactsData = await response.json();
          console.log(chatContactsData);
          setChatContacts(chatContactsData);
        } else {
          console.error('Error getting contacts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching chat contacts:', error);
      }
    };

    fetchChatContacts();
  }, [user.uid]);

  // Function to handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  return (

    <Flex h="100%">

      <SideBar/>


    <Flex 
      flex="1" direction="column">

      <TopBar/>


      <Flex h="70vh" direction={"column"} pt="4" mx="5" overflowX={"auto"} > 

      <Flex bg="whiteAlpha.100" w="fit-content" minWidth={"100px"} borderRadius={"lg"} p="3" m="1">

        <Text>This is a message</Text>
      </Flex>
      <Flex bg="whiteAlpha.100" w="fit-content" minWidth={"100px"} borderRadius={"lg"} p="3" m="1">

        <Text>This is a message</Text>
      </Flex>
      <Flex bg="teal.400" w="fit-content" minWidth={"100px"} borderRadius={"lg"} p="3" m="1" alignSelf={"flex-end"}>

        <Text>This is a message</Text>
      </Flex>

      
      
      
      
      </Flex>

      <BottomBar/>

      </Flex>

    </Flex>

  );
};

export default Messages;
