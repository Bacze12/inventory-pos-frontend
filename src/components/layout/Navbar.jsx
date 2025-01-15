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
  useColorMode,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Link,
} from '@chakra-ui/react';
import { Menu as MenuIcon, Sun, Moon, User, LogOut, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';
import { SearchIcon } from '@chakra-ui/icons';

const Navbar = ({ onMenuClick, username, isOpen }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Box 
    position="fixed"
    top={0}
    left={0}
    right={0}
    bg={colorMode === 'light' ? 'white' : 'gray.600'}
    borderBottomWidth="1px"
    shadow="sm"
    py={1}
    mb="50px"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex h="1" alignItems="center" mx="3" justifyContent="space-between">
          <Link to="/home" onClick={() => navigate('/home')}>
            <Text fontSize="xl" fontWeight="bold" alignItems={"center"}>
              SGI
            </Text>
          </Link>
        </Flex>
        <Flex h="1" alignItems="center" mx="1" justifyContent="space-between">
          <Text > x </Text>
        </Flex>
        <HStack spacing={4}>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onMenuClick}
            variant="ghost"
            aria-label="open menu"
            icon={<MenuIcon />}
          />
        </HStack>

        <Flex flex="1" justifyContent="center">
          <form onSubmit={handleSearch}>
            <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar productos, clientes, proveedores, categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              width="400px"
            />
          </InputGroup>
          </form>
        </Flex>

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