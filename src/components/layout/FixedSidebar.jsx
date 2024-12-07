import React from 'react';
import { Box, VStack, Icon, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, ShoppingCart, Package, Users, Settings } from 'lucide-react';

/**
 * Rutas de navegación.
 */
const NavItems = [
  { name: 'Inicio', icon: Home, path: '/home' },
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'POS', icon: ShoppingCart, path: '/pos' },
  { name: 'Inventario', icon: Package, path: '/inventory' },
  { name: 'Usuarios', icon: Users, path: '/users' },
  { name: 'Configuración', icon: Settings, path: '/settings' },
];

/**
 * Componente de barra lateral fija.
 */
export const FixedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeBg = useColorModeValue('gray.100', 'gray.700');

  /**
   * Componente para renderizar un elemento de navegación.
   */
  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <Flex
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ bg: activeBg }}
        onClick={() => navigate(item.path)}
      >
        <Icon as={item.icon} mr="4" fontSize="16" />
        <Text>{item.name}</Text>
      </Flex>
    );
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      w="240px"
      h="100vh"
      pos="fixed"
      borderRightWidth="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <VStack spacing="1" align="stretch" p="4">
        {NavItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </VStack>
    </Box>
  );
};
