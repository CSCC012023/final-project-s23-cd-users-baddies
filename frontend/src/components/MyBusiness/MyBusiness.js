import React, { useState, useContext, useEffect, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  ChakraProvider,
  Textarea,
  Drawer,
  DrawerContent,
  Box,
  Text,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Center,
  Avatar,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Flex,
  Icon,
  IconButton,
  CloseButton,
} from '@chakra-ui/react'; import { FiHome, FiUsers, FiStar, FiCalendar } from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import ReviewsTab from './Reviews/Reviews';
import ServicesTab from './Services/Services';
import axios from 'axios';
import ServiceCard from './Services/ServiceCard';
import ClientCard from './Clients/Clients';
import Schedule from './Schedule/Schedule';
import { backendUrl } from '../../config';


const MyBusiness = () => {

  const LinkItems = [
    { name: 'Services', icon: FiHome, content: ServicesTab },
    { name: 'Schedule', icon: FiCalendar, content: ScheduleTab },
    { name: 'Clients', icon: FiUsers, content: ClientsTab },
    { name: 'My Reviews', icon: FiStar, content: ReviewsTab },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function for handling the navigation items in the sidebar
  function NavItem({ icon, children, onClick, ...rest }) {
    return (
      <Box
        as="button"
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        onClick={onClick}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    );
  }

  function SidebarContent({ onClose, ...rest }) {
    const user = useContext(UserContext);
    const userType = user.userType;

    return (
      <Box
        borderRight="1px"
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link, index) => {
          if (link.isBusiness && userType !== 'business') {
            return null;
          }

          return (
            <NavItem key={index} icon={link.icon} onClick={() => setActiveTab(index)}>
              {link.name}
            </NavItem>
          );
        })}
      </Box>
    );
  }


  function ScheduleTab() {
    return (
      <Schedule />
    );
  }

  function ClientsTab() {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
      clientName: '',
      lastDealTimestamp: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useContext(UserContext);

    useEffect(() => {
      fetchUserClients();
    }, []);

    const fetchUserClients = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/clients/${user.uid}`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    return (
      <Box>
        <Box mt="90px">
          <Flex flexWrap="wrap" justifyContent="flex-start">
            {clients.map((client) => (
              <ClientCard />
            ))}
          </Flex>
        </Box>
        <Box position="fixed" bottom="4" right="4">
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box ml={{ base: 0, md: 60 }} p="4">
        {activeTab < LinkItems.length && React.createElement(LinkItems[activeTab].content)}
      </Box>
    </Box>
  );
};

export default MyBusiness;
