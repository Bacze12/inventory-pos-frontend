import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';

/**
 * NavItem Component
 * Representa un elemento de la barra de navegación.
 * @param {Object} item - Elemento de navegación (con `path`, `label` y `icon`).
 * @param {Function} navigate - Función para manejar la navegación.
 * @param {boolean} isCollapsed - Indica si la barra lateral está colapsada.
 */
const NavItem = ({ item, navigate, isCollapsed }) => {
  return (
    <Flex
      align="center"
      p={isCollapsed ? 2 : 4}
      mx={2}
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: 'gray.100' }}
      onClick={() => navigate(item.path)}
    >
      <Icon as={item.icon} boxSize={isCollapsed ? 6 : 4} />
      {!isCollapsed && (
        <Text ml={4} fontSize="sm">
          {item.label}
        </Text>
      )}
    </Flex>
  );
};

export default NavItem;
