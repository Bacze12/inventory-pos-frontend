import {
    Box,
    VStack,
    Icon,
    Text,
    Flex,
    IconButton,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Settings,
    Menu,
    Home,
    Users,
    FileText,
  } from 'lucide-react';
  import { useSelector } from 'react-redux'; // Si usas Redux
  
  const NavItems = [
    { name: 'Inicio', icon: Home, path: '/home' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin'] },
    { name: 'POS', icon: ShoppingCart, path: '/ventas' },
    { name: 'Inventario', icon: Package, path: '/inventario' },
    { name: 'Reportes', icon: FileText, path: '/reportes', roles: ['admin'] },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Configuración', icon: Settings, path: '/configuracion', roles: ['admin'] },
  ];
  
  export const CollapsibleSidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user); // Si usas Redux para autenticación
  
    const NavItem = ({ item }) => {
      const isActive = location.pathname === item.path;
      const bg = useColorModeValue('gray.100', 'gray.700');
  
      // Filtrar por roles si el usuario tiene roles asignados
      if (item.roles && !item.roles.includes(user?.role)) {
        return null;
      }
  
      return (
        <Flex
          align="center"
          p="4"
          mx={isOpen ? '4' : '2'}
          borderRadius="lg"
          cursor="pointer"
          bg={isActive ? bg : 'transparent'}
          _hover={{ bg }}
          onClick={() => navigate(item.path)}
        >
          <Icon as={item.icon} mr={isOpen ? '4' : '0'} fontSize="16" />
          {isOpen && <Text>{item.name}</Text>}
        </Flex>
      );
    };
  
    return (
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        w={isOpen ? '240px' : '60px'}
        h="100vh"
        pos="fixed"
        transition="width 0.3s"
      >
        <Flex h="20" align="center" px="4" justify="space-between">
          <IconButton
            icon={<Menu />}
            aria-label="Toggle Sidebar"
            size="sm"
            onClick={onToggle}
          />
        </Flex>
        <VStack spacing="1" align="stretch">
          {NavItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </VStack>
      </Box>
    );
  };
  