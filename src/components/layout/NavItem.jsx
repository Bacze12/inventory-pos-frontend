import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';

/**
 * NavItem Component
 * Representa un elemento de la barra de navegación.
 * @param {Object} item - Elemento de navegación (con `path` y `label`).
 * @param {Function} navigate - Función para navegar al `path`.
 */
const NavItem = ({ item, navigate }) => {
  return (
    <Flex
      align="center"
      p={2}
      mx={2}
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: 'gray.100' }}
      onClick={() => navigate(item.path)}
    >
      <Icon as={item.icon} mr={2} />
      <Text>{item.label}</Text>
    </Flex>
  );
};

export default NavItem;
