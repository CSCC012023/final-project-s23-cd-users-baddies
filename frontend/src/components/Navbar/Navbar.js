import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar({ userType }) {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      backgroundColor="#333"
      color="white"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999"
    >
      <Box>
        <NavLink to="/profile">Profile</NavLink>
        {userType === "customer" && (
          <>
            <NavLink to="/myposts" ml={45}>My Posts</NavLink>
          </>
        )}
        {userType === "business" && (
          <>
            <NavLink to="/mygigs" ml={45}>My Gigs</NavLink>
          </>
        )}
      </Box>
      <Flex align="center">
        <Link
          as={RouterLink}
          to="/"
          fontSize="2xl"
          fontWeight="bold"
          textDecoration="none"
        >
          BizReach
        </Link>
      </Flex>
      <Box>
        {userType === "customer" && (
          <>
            <NavLink to="/discoverposts">Discover</NavLink>
          </>
        )}
        {userType === "business" && (
          <>
            <NavLink to="/discoverbusinesses">Discover</NavLink>
            <NavLink to="/mybusiness" ml={45}>My Business</NavLink>
          </>
        )}
        {userType === "customer" && (
          <>
            <NavLink to="/post" ml={45}>Post</NavLink>
          </>
        )}
      </Box>
    </Flex>
  );
}

function NavLink({ to, children, ...rest }) {
  return (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded="md"
      _hover={{ backgroundColor: "#555" }}
      mr={2}
      {...rest}
    >
      {children}
    </Link>
  );
}

