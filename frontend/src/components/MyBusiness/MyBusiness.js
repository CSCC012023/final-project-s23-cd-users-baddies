import React, { useState, useContext, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  Box,
  Text,
  useDisclosure,
  Flex,
  Icon,
  CloseButton,
} from '@chakra-ui/react';import { FiHome, FiUsers, FiStar, FiCalendar } from 'react-icons/fi';
import { UserContext } from '../User/UserContext';
import ReviewsTab from './Reviews/Reviews';
import ServicesTab from './Services/Services';


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

  function ScheduleTab () {

  }

  function ClientsTab () {
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
