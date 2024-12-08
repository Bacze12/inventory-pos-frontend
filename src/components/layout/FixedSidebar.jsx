import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import NavItem from './NavItem';

const FixedSidebar = ({ NavItems, navigate }) => {
  return (
    <Box w="250px" bg="gray.50" h="100vh" position="fixed" p={4}>
      <VStack align="stretch">
        {NavItems.map((item) => (
          <NavItem key={item.path} item={item} navigate={navigate} />
        ))}
      </VStack>
    </Box>
  );
};

export default FixedSidebar;
