import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text, 
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store/slices';
import { Navbar } from './Navbar';
import { CollapsibleSidebar } from './CollapsibleSidebar';

export const Layout = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex h="100vh">
      <CollapsibleSidebar isOpen={isOpen} onToggle={onToggle} />
      <Box
        flex="1"
        ml={isOpen ? '240px' : '60px'}
        transition="margin-left 0.3s"
      >
        <Navbar onMenuClick={onToggle} userName={''} />
        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;