import React from 'react';
import { Flex, Text, Box, Divider } from "@chakra-ui/react";

const NotificationItem = ({ notification }) => {
  const { text, timestamp, type } = notification;

  return (
    <Box py={3}>
      <Flex justify="space-between">
        <Text fontWeight="bold">{text}</Text>
        <Text fontSize="sm" color="gray.500">{new Date(timestamp).toLocaleString()}</Text>
      </Flex>
      <Text fontSize="sm" color="gray.500">{type}</Text>
      <Divider my={2} />
    </Box>
  );
};

export default NotificationItem;
