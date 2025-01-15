import React from 'react';
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
  Tags, // Importar el ícono Tags de lucide-react
} from 'lucide-react';
import { MdInventory } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';



const NavItems = [
  { name: 'Home', icon: Home, path: '/home' },
  { name: 'Home Cashier', icon: Home, path: '/home-cajera', roles: ['cashier'] },
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard'},
  { name: 'POS', icon: ShoppingCart, path: '/pos' },
  {name: 'Mantenimiento', icon: MdInventory, children: [
    { name: 'Productos', icon: Tags, path: '/products' },
    { name: 'Inventario', icon: MdInventory, path: '/inventory' },
    { name: 'Usuarios', icon: Users, path: '/users' },
    { name: 'Categorias', icon: Tags, path: '/categories' },
    { name: 'Proveedores', icon: Tags, path: '/suppliers' },
  ]
  },
  //{ name: 'Productos', icon: Tags, path: '/products' }, // Usar el ícono Tags importado
  //{ name: 'Inventario', icon: MdInventory, path: '/inventory' },
  // { name: 'Reportes', icon: FileText, path: '/reports' },
  // { name: 'Clientes', icon: Users, path: '/clients' },
  //{ name: 'Usuarios', icon: Users, path: '/users' },
  //{ name: 'categorias', icon: Tags, path: '/categories' },
  //{ name: 'Proveedores', icon: Tags, path: '/suppliers' }, // Agregar la ruta de proveedores
  { name: 'Configuración', icon: Settings, path: '/system-configuration' },
];

const CollapsibleSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const bg = useColorModeValue('gray.100', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.600');
  const activeBg = useColorModeValue('white.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (!isOpen) {
      setIsMaintenanceOpen(false);
    }
  }, [isOpen]);

  const NavItem = ({ item }) => {
    const isActive = window.location.pathname === item.path;

    if (item.roles && !item.roles.includes(user?.role || '')) {
      return null;
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
        onClick={() => setIsMaintenanceOpen(!isMaintenanceOpen)}
      >
        <Icon
          mr={isOpen ? '4' : '0'}
          fontSize="16"
          as={item.icon}
          color={isActive ? 'blue.500' : undefined}
        />
        {isOpen && (
        <>
        <Text color={isActive ? 'blue.500' : undefined}>{item.name}</Text>
        <Icon as={isMaintenanceOpen ? ChevronUpIcon : ChevronDownIcon} ml="auto" />
        </>
        )}
      </Flex>
      <Collapse in={isMaintenanceOpen} animateOpacity>
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
          color={isActive ? 'blue.500' : undefined}
        />
        {isOpen && <Text color={isActive ? 'blue.500' : undefined}>{item.name}</Text>}
      </Flex>
    );
  };

    return (
      <Box
      bg={sidebarBg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={isOpen ? '240px' : '60px'}
      h="100vh"
      pos="fixed"
      top = "49px"
      transition="width 0.3s"
    >
      
      <Flex h="20" alignItems="center" mx="3" justifyContent="space-between">
        <IconButton
          aria-label="Toggle Sidebar"
          icon={<Menu />}
          size="sm"
          onClick={onToggle} // Alternar estado al hacer clic
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