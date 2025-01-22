import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  IconButton,
  useColorModeValue,
  Collapse,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Menu,
  Home,
  Users,
  Tags,
} from 'lucide-react';
import { MdInventory } from 'react-icons/md';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const NavItems = [
  { name: 'Home', icon: Home, path: '/home' },
  { name: 'Home Cashier', icon: Home, path: '/home-cajera', roles: ['cashier, ADMIN'] },
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'POS', icon: ShoppingCart, path: '/pos' },
  {
    name: 'Mantenimiento',
    icon: MdInventory,
    children: [
      { name: 'Productos', icon: Tags, path: '/products' },
      { name: 'Inventario', icon: MdInventory, path: '/inventory' },
      { name: 'Usuarios', icon: Users, path: '/users' },
      { name: 'Categorias', icon: Tags, path: '/categories' },
      { name: 'Proveedores', icon: Tags, path: '/suppliers' },
    ],
  },
  { name: 'Configuración', icon: Settings, path: '/settings' },
];

const CollapsibleSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Solo dependemos del token

  // Redirigir al login si no hay token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const bg = useColorModeValue('gray.100', 'gray.700');
  const sidebarBg = useColorModeValue('linear(to-t, green.300, gray.50)', 'gray.600');
  const activeBg = useColorModeValue('white.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  const NavItem = ({ item }) => {
    const isActive = window.location.pathname === item.path;

    const handleNavigation = (path) => {
      if (token) {
        navigate(path);
      } else {
        console.log('No autenticado, redirigiendo a login');
        navigate('/login');
      }
    };

    // Si el elemento tiene roles, verificamos que sean compatibles (ajustado según sea necesario)
    if (item.roles && !item.roles.includes('default')) {
      return null; // Cambia "default" por el rol esperado si es necesario
    }

    if (item.children) {
      return (
        <Box key={item.name}>
          <Flex
            align="center"
            p="4"
            mx={isOpen ? '4' : '2'}
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={isActive ? activeBg : 'transparent'}
            _hover={{ bg }}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon
              mr={isOpen ? '4' : '0'}
              fontSize="16"
              as={item.icon}
              color={isActive ? 'green.500' : undefined}
            />
            {isOpen && (
              <>
                <Text color={isActive ? 'green.500' : undefined}>{item.name}</Text>
                <Icon as={ChevronDownIcon} ml="auto" />
              </>
            )}
          </Flex>
          <Collapse in={isOpen} animateOpacity>
            <Box pl={8}>
              {item.children.map((child) => (
                <Flex
                  key={child.name}
                  align="center"
                  p="4"
                  mx={isOpen ? '4' : '2'}
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  bg={window.location.pathname === child.path ? bg : 'transparent'}
                  _hover={{ bg }}
                  onClick={() => navigate(child.path)}
                >
                  <Text>{child.name}</Text>
                </Flex>
              ))}
            </Box>
          </Collapse>
        </Box>
      );
    }

    return (
      <Flex
        key={item.name}
        align="center"
        p="4"
        mx={isOpen ? '4' : '2'}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ bg }}
        onClick={() => navigate(item.path)}
      >
        <Icon
          mr={isOpen ? '4' : '0'}
          fontSize="16"
          as={item.icon}
          color={isActive ? 'green.500' : undefined}
        />
        {isOpen && <Text color={isActive ? 'green.500' : undefined}>{item.name}</Text>}
      </Flex>
    );
  };

  return (
    <Box
      bg={sidebarBg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={isOpen ? '210px' : '60px'}
      h="100vh"
      transition="width 0.3s"
    >
      <Flex h="20" alignItems="center" mx="3" justifyContent="space-between">
        <IconButton
          aria-label="Toggle Sidebar"
          icon={<Menu />}
          size="sm"
          onClick={onToggle}
          bg="transparent"
          _hover={{ bg: hoverBg }}
        />
      </Flex>
      <VStack spacing={1} align="stretch">
        {NavItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </VStack>
    </Box>
  );
};

export default CollapsibleSidebar;
