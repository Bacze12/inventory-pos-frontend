import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  useColorModeValue,
  CloseButton
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LineChart,
  Settings
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface FixedSidebarProps {
  onClose: () => void;
  display: { base: string; md: string };
}

interface NavItem {
  name: string;
  icon: React.ComponentType;
  path: string;
  roles?: string[];
}

const NavItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'POS', icon: ShoppingCart, path: '/pos' },
  { name: 'Productos', icon: Package, path: '/products' },
  { name: 'Ventas', icon: LineChart, path: '/sales' },
  { name: 'Configuración', icon: Settings, path: '/settings', roles: ['admin'] }
];

export const FixedSidebar = ({ onClose, display }: FixedSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const bg = useColorModeValue('gray.100', 'gray.700');

    if (item.roles && !item.roles.includes(user?.role || '')) {
      return null;
    }

    return (
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? bg : 'transparent'}
        _hover={{ bg }}
        onClick={() => navigate(item.path)}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={item.icon}
          color={isActive ? 'blue.500' : undefined}
        />
        <Text color={isActive ? 'blue.500' : undefined}>{item.name}</Text>
      </Flex>
    );
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w="240px"
      h="100vh"
      pos="fixed"
      display={display} // Aplica la propiedad display
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          SGC
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={1} align="stretch">
        {NavItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </VStack>
    </Box>
  );
};
