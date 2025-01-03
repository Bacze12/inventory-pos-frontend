import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  HStack
} from '@chakra-ui/react';
import { Menu as MenuIcon, Sun, Moon, User, LogOut, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick, username  }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box px={4} py={2} bg={colorMode === 'light' ? 'white' : 'gray.900'} borderBottomWidth="1px" shadow="sm" >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing={4}>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onMenuClick}
            variant="ghost"
            aria-label="open menu"
            icon={<MenuIcon />}
          />
          <Link to="/home">
            <Text fontSize="xl" fontWeight="bold">
              SGI
            </Text>
          </Link>
        </HStack>

        <HStack spacing={4}>

        <Flex alignItems="center">
          <HStack spacing={4}>
            {user?.role === 'CASHIER' && (  // Si el usuario es Cajero, mostrar los botones de Apertura y Cierre de Caja
              <>
                <Button onClick={() => navigate('/cash-opening')} leftIcon={<DollarSign />}>
                  Apertura de Caja
                </Button>
                <Button onClick={() => navigate('/cash-closing')} leftIcon={<DollarSign />}>
                  Cierre de Caja
                </Button>
              </>
            )}


          <IconButton
            icon={colorMode === 'light' ? <Moon /> : <Sun />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="toggle theme"
          />
          

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<User />}
              variant="ghost"
            >
              {user?.name}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={18} />}>
                Perfil
              </MenuItem>
              <MenuItem 
                icon={<LogOut size={18} />} 
                onClick={handleLogout}
                color="red.500"
              >
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </HStack>
  </Flex>
</Box>
  );
};

export default Navbar;