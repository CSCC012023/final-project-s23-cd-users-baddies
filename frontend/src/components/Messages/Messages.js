import React, { useEffect, useState, useContext, useRef } from 'react';
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
import io from 'socket.io-client';

// Replace this with the actual URL of your Socket.IO server
const SERVER_URL = 'http://localhost:3001';

const SideBar = ({ handleContactSelect }) => {
  const user = useContext(UserContext);
  const [chatContacts, setChatContacts] = useState([]);

  useEffect(() => {
    const fetchChatContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/messages/contacts/${user.uid}`);
        if (response.ok) {
          const chatContactsData = await response.json();
          setChatContacts(chatContactsData);

          // console.log(chatContacts);
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
          <Text color="teal.400">{user.Name}</Text>
        </Flex>
      </Flex>
      <Flex flexDirection="column" overflowX="scroll" sx={{ scrollbarWidth: "0px" }} flex={1}>
        {chatContacts.map((contact) => (
          <Chat key={contact.id} contact={contact} handleContactSelect={handleContactSelect} />
        ))}
      </Flex>
    </Flex>
  );
};

const Chat = ({ contact, handleContactSelect }) => {
  const handleClick = () => {
    handleContactSelect(contact); // Make sure `contact` has the `uid` property
    console.log(contact)
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

const BottomBar = ({ handleSendMessage, selectedContact }) => { // Receive `selectedContact` from the parent component
  const [messageText, setMessageText] = useState('');

  const sendMessage = () => {
    handleSendMessage(messageText, selectedContact.userId); // Pass the `selectedContact.userId` as a second argument
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    // Check if the Enter key was pressed (key code 13)
    if (e.keyCode === 13) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      handleSendMessage(messageText, selectedContact.userId);
      setMessageText('');
    }
  };

  return (
    <FormControl padding={3} justifyContent="space-between">
      <Input
        w="70%"
        placeholder="Type a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown} // Attach the handleKeyDown event directly here
      />
      <Button w="10%" onClick={sendMessage}>
        Send
      </Button>
    </FormControl>
  );
};



const Messages = ({ selectedUserUid }) => {
  const user = useContext(UserContext);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatContacts, setChatContacts] = useState([]);
  const [chatMessagesData, setChatMessagesData] = useState({});

  useEffect(() => {
    const fetchChatContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/messages/contacts/${user.uid}`);
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

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  
    // If messages for the selected contact already exist in the state, no need to fetch again
    if (chatMessagesData[contact.userId]) {
      return;
    }
  
    // Pass the selected user's UID as a prop
    fetchChatMessages(contact.userId);
  };

  const fetchChatMessages = async (selectedUserUid) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${user.uid}/${selectedUserUid}`
      );
      if (response.ok) {
        const chatMessagesDataForContact = await response.json();
        console.log('Fetched messages for', selectedUserUid, ':', chatMessagesDataForContact);
  
        // Update the state with the new messages for the selected contact
        setChatMessagesData((prevChatMessages) => ({
          ...prevChatMessages,
          [selectedUserUid]: chatMessagesDataForContact,
        }));
         console.log(selectedUserUid)
      } else {
        console.error('Error getting chat messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };
  

  const handleSendMessage = async (text, selectedUserUid) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${user.uid}/${selectedUserUid}`,
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
          // Assume the current user is the sender
          sender: { _path: { segments: ['', user.uid] } },
        };

        // Update the state with the new message for the selected contact
        setChatMessagesData((prevChatMessages) => ({
          ...prevChatMessages,
          [selectedUserUid]: [
            ...(prevChatMessages[selectedUserUid] || []),
            newMessage,
          ],
        }));
        console.log(chatMessagesData);
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
              {selectedContact.userId in chatMessagesData ? ( // Check if the messages are available in the state
                chatMessagesData[selectedContact.userId].map((message, index) => (
                  <Message
                    key={index}
                    message={message}
                    isCurrentUser={message.sender._path.segments[1] === user.uid}
                  />
                ))
              ) : (
                <Text>No messages found for this contact.</Text>
              )}
            </Flex>
            <BottomBar handleSendMessage={handleSendMessage} selectedContact={selectedContact} />
          </>
        )}
      </Flex>
    </Flex>
  );
};



const Message = ({ message, isCurrentUser }) => {
  const backgroundColor = isCurrentUser ? "teal.400" : "whiteAlpha.100";
  const textColor = isCurrentUser ? "white" : "inherit";
  const alignSelf = isCurrentUser ? "flex-end" : "flex-start";
  const marginLeft = isCurrentUser ? "auto" : "unset";

  return (
    <Flex
      bg={backgroundColor}
      color={textColor}
      w="fit-content"
      minWidth="100px"
      borderRadius="lg"
      p="3"
      m="1"
      alignSelf={alignSelf}
      marginLeft={marginLeft}
    >
      <Text>{message.text}</Text>
    </Flex>
  );
};


export default Messages;