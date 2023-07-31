import React, { useState } from 'react';
import MyBusiness from './MyBusiness';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiCalendar, FiStar, FiUsers } from 'react-icons/fi';

const LinkItems = [
  { name: 'Services', icon: FiHome },
  { name: 'Schedule', icon: FiCalendar },
  { name: 'Statistics', icon: FiTrendingUp },
  { name: 'Clients', icon: FiUsers },
  { name: 'Reviews', icon: FiStar },
];

export default function SimpleSidebar() {
  const { isOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {/* Pass handleTabClick as a prop to SidebarContent */}
      <SidebarContent onClose={onClose} handleTabClick={handleTabClick} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          {/* Pass handleTabClick as a prop to SidebarContent */}
          <SidebarContent onClose={onClose} activeTab={activeTab} handleTabClick={handleTabClick} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {activeTab === 'Services' && <MyBusiness activeTab={activeTab} handleTabClick={handleTabClick}/>}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, handleTabClick, activeTab, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
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
      {LinkItems.map((link) => (
       <NavItem
        key={link.name}
        activeTab={activeTab}
        icon={link.icon}
        handleTabClick={handleTabClick}
      >
       {link.name}
     </NavItem>
      ))}
    </Box>
  );
};


const NavItem = ({ icon, handleTabClick, children, activeTab, ...rest }) => {
  return (
    <Box as="a" href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
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
        onClick={() => {
          handleTabClick(children); // Call the handleTabClick function from SimpleSidebar
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
};

