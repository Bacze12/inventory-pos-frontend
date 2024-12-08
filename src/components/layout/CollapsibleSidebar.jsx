import React, { useState } from 'react';
import { Box, VStack, IconButton, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NavItem from './NavItem';

/**
 * CollapsibleSidebar Component
 * Barra lateral con funcionalidad de colapso/expansión.
 * @param {Array} NavItems - Lista de elementos de navegación (con `path`, `label`, y `icon`).
 * @param {Function} navigate - Función para manejar la navegación.
 */
const CollapsibleSidebar = ({ NavItems, navigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      w={isCollapsed ? '60px' : '250px'}
      bg="white"
      boxShadow="lg"
      h="100vh"
      overflowY="auto"
      position="relative"
      transition="width 0.3s"
    >
      {/* Botón para expandir/contraer */}
      <IconButton
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        position="absolute"
        top="10px"
        right={isCollapsed ? '-20px' : '-40px'}
        size="sm"
        bg="white"
        boxShadow="md"
        _hover={{ bg: 'gray.100' }}
      />

      <Flex
        direction="column"
        alignItems={isCollapsed ? 'center' : 'stretch'}
        h="100%"
        p={isCollapsed ? 2 : 4}
      >
        {!isCollapsed && (
          <Text fontWeight="bold" fontSize="xl" mb={4}>
            Menú
          </Text>
        )}

        <VStack align={isCollapsed ? 'center' : 'stretch'} spacing={4}>
          {NavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              navigate={navigate}
              isCollapsed={isCollapsed}
            />
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default CollapsibleSidebar;
