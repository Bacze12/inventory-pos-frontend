import {
    Box,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    useColorMode,
    HStack,
    Button,
  } from '@chakra-ui/react';
  import { Menu as MenuIcon, Sun, Moon, User, LogOut } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { logout } from '../../store/slices/authSlice'; // Ajusta según tu estructura
  import React from 'react';
  
  export const Navbar = ({ onMenuClick }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user); // Cambia si no usas Redux
  
    const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };
  
    return (
      <Box
        px={4}
        py={2}
        bg="white"
        _dark={{ bg: 'gray.800' }}
        borderBottomWidth="1px"
        shadow="sm"
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              SGI
            </Text>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === 'light' ? <Moon /> : <Sun />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
            />
            <Menu>
              <MenuButton as={Button} rightIcon={<User />}>
                {user?.name || 'Usuario'}
              </MenuButton>
              <MenuList>
                <MenuItem icon={<User />} onClick={() => navigate('/perfil')}>
                  Perfil
                </MenuItem>
                <MenuItem
                  icon={<LogOut />}
                  color="red.500"
                  onClick={handleLogout}
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