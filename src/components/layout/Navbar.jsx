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
import { Menu as MenuIcon, Sun, Moon, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/slices'; // Corregir la ruta de importación
import { logout } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const Navbar = ({ onMenuClick, isSidebarOpen }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      position="fixed"
      top="0"
      left={isSidebarOpen ? '240px' : '60px'} // Ajusta el margen izquierdo según el estado de la barra lateral
      width={`calc(100% - ${isSidebarOpen ? '240px' : '60px'})`} // Ajusta el ancho según el estado de la barra lateral
      zIndex="1000"
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderBottomWidth="1px"
      shadow="sm"
      transition="left 0.3s, width 0.3s"
    >
      <Flex alignItems="center" justifyContent="space-between" px={4} py={2}>
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
    </Box>
  );
};