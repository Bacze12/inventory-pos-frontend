import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import NavItem from './NavItem';

/**
 * CollapsibleSidebar Component
 * Representa una barra lateral con navegación colapsable.
 * @param {Array} NavItems - Lista de elementos de navegación (con `path`, `label`, y `icon`).
 * @param {Function} navigate - Función para manejar la navegación.
 */
const CollapsibleSidebar = ({ NavItems, navigate }) => {
  return (
    <Box
      w="250px"
      bg="white"
      boxShadow="lg"
      h="100vh"
      overflowY="auto"
      p={4}
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Menú
      </Text>
      <VStack align="stretch" spacing={2}>
        {NavItems.map((item) => (
          <NavItem key={item.path} item={item} navigate={navigate} />
        ))}
      </VStack>
    </Box>
  );
};

export default CollapsibleSidebar;
