import React, { useEffect, useState, useContext } from 'react';
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

const SideBar = ({ handleContactSelect }) => {
  // const user = useContext(UserContext);
  const [chatContacts, setChatContacts] = useState([]);

  const sampleChatContacts = [
    { id: 1, name: "John Doe", avatar: "" },
    { id: 2, name: "Jane Smith", avatar: "" },
    { id: 3, name: "Alice Johnson", avatar: "" },
    // Add more sample contacts as needed
  ];

  useEffect(() => {
    const fetchChatContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/messages/contacts/VB4yMIbysHUjx2MOBLj8`);
        if (response.ok) {
          const chatContactsData = await response.json();
          setChatContacts(chatContactsData);
        } else {
          console.error('Error getting contacts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching chat contacts:', error);
      }
    };

    fetchChatContacts();
  }, []);

  return (
    <Flex
      h="100vh"
      w="50vh"
      borderEnd="1px solid"
      borderColor="#50545c"
      direction="column"
    >
      <Flex
        w="100%"
        h="20vh"
        align="center"
        borderBottom="1px solid"
        borderColor="#50545c"
      >
        <Avatar mt="75px" ml="20px"></Avatar>
        <Flex align="center" justifyContent="space-between" mt="10vh" marginEnd={3} p="3">
          <Text color="teal.400">{"user.Name"}</Text>
        </Flex>
      </Flex>
      <Flex flexDirection="column" overflowX="scroll" sx={{ scrollbarWidth: "0px" }} flex={1}>
        {sampleChatContacts.map((contact) => (
          <Chat key={contact.id} contact={contact} handleContactSelect={handleContactSelect} />
        ))}
      </Flex>
    </Flex>
  );
};

const Chat = ({ contact, handleContactSelect }) => {
  const handleClick = () => {
    handleContactSelect(contact);
  };

  return (
    <Flex m="3" p={3} align="center" _hover={{ bg: "teal.400", cursor: "pointer" }} onClick={handleClick}>
      <Avatar src={contact.avatar} />
      <Text ml="10px">{contact.name}</Text>
    </Flex>
  );
};

const TopBar = ({ selectedContact }) => {
  return (
    <Flex w="100%" h="20vh" align="center" borderBottom="1px solid" borderColor="#50545c">
      <Avatar mt="10vh" src={selectedContact.avatar} ml="3" />
      <Text color="white" align="center" justifyContent="space-between" mt="10vh" marginEnd={3} p="3">
        {selectedContact.name}
      </Text>
    </Flex>
  );
};

const BottomBar = ({ handleSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const sendMessage = () => {
    handleSendMessage(messageText);
    setMessageText('');
  };

  return (
    <FormControl padding={3} justifyContent="space-between">
      <Input
        w="70%"
        placeholder="Type a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <Button w="10%" onClick={sendMessage}>
        Send
      </Button>
    </FormControl>
  );
};

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessagesData, setChatMessagesData] = useState([]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/xqZkfFFi6SHefADzUIH2/VB4yMIbysHUjx2MOBLj8`
        ); 
        if (response.ok) {
          const chatMessagesData = await response.json();
          setChatMessagesData(chatMessagesData);
        } else {
          console.error('Error getting chat messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();
  };

  const handleSendMessage = async (text) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/VB4yMIbysHUjx2MOBLj8/xqZkfFFi6SHefADzUIH2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );

      if (response.ok) {

        const newMessage = {
          text,
          sender: { _path: { segments: [''] } }, // Assume the current user is the sender
        };
        setChatMessagesData((prevChatMessages) => [prevChatMessages, newMessage]);
        console.log(chatMessagesData)
        // setMessageText(''); // Clear the input field
      } else {
        console.error('Error sending message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Flex h="100%">
      <SideBar handleContactSelect={handleContactSelect} />
      <Flex flex="1" direction="column">
        {selectedContact && (
          <>
            <TopBar selectedContact={selectedContact} />
            <Flex h="70vh" direction="column" pt="4" mx="5" overflowX="auto">
              {chatMessagesData.map((message, index) => (
                <Message key={index} message={message} />
              ))}
            </Flex>
            <BottomBar handleSendMessage={handleSendMessage} />
          </>
        )}
      </Flex>
    </Flex>
  );
};

const Message = ({ message }) => {
  const isSentByCurrentUser = message.sender && message.sender._path.segments[1] === 'VB4yMIbysHUjx2MOBLj8';
  return (
    <Flex
      bg={isSentByCurrentUser ? "teal.400" : "whiteAlpha.100"}
      color={isSentByCurrentUser ? "white" : "inherit"}
      w="fit-content"
      minWidth="100px"
      borderRadius="lg"
      p="3"
      m="1"
      alignSelf={isSentByCurrentUser ? "flex-end" : "flex-start"}
      marginLeft={isSentByCurrentUser ? "auto" : "unset"} // Add this line
    >
      <Text>{message.text}</Text>
    </Flex>
  );
};

export default Messages;
